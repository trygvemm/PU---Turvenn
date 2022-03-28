const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./models');
const { User } = require('./models');

require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = 4000;

app.disable('etag');

app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/uploads', express.static('uploads'));

app.use('/api/users', require('./routes/user'));
app.use('/api/trips', require('./routes/trip'));

app.use((err, req, res, next) => errorHandler(err, req, res, next));

sequelize
  .authenticate()
  .then(async () => {
    // Create super admin if not exists
    if (!(await User.findOne({ where: { email: 'turvenn.turvenn@gmail.com' } }))) {
      const salt = await bcrypt.genSalt(10);
      const password = process.env.TURVENN_PASSWORD || 'password';
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.create({
        email: 'turvenn.turvenn@gmail.com',
        firstName: 'Turvenn',
        lastName: 'Turvenn',
        role: 'admin',
        password: hashedPassword
      });
    }
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
