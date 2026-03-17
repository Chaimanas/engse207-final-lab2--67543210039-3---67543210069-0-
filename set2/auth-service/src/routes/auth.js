const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/db');
const { generateToken, verifyToken } = require('../middleware/jwtUtils');

const router = express.Router();