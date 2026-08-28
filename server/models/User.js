const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { USER_ROLES } = require('../config/constants');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
    },
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLES),
        message: '{VALUE} is not a valid role'
      },
      default: USER_ROLES.STUDENT
    },
    permissions: [
      {
        resource: {
          type: String,
          required: true
        },
        actions: [
          {
            type: String,
            required: true
          }
        ]
      }
    ],
    profile: {
      bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        default: ''
      },
      phone: {
        type: String,
        default: ''
      },
      institution: {
        type: String,
        default: ''
      },
      dateOfBirth: {
        type: Date
      },
      city: {
        type: String,
        default: ''
      },
      state: {
        type: String,
        default: ''
      }
    },
    studyStreak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastStudyDate: {
        type: Date
      }
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    badges: [
      {
        name: {
          type: String,
          required: true
        },
        description: {
          type: String
        },
        icon: {
          type: String
        },
        earnedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    achievements: [
      {
        title: {
          type: String
        },
        description: {
          type: String
        },
        category: {
          type: String
        },
        unlockedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ lastActive: -1 });

// Pre-save hook: Hash password if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Method: Match entered password with hashed password in database
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Method: Generate and sign JWT token
 * @returns {string} Signed JWT Token
 */
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      name: this.name,
      email: this.email
    },
    process.env.JWT_SECRET || 'default_jwt_secret_dev',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

module.exports = mongoose.model('User', UserSchema);
