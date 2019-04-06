const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

require('dotenv').config()
require('./bin/connection')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

const userRouter = require('./routes/user');
app.use('/user', userRouter)

const userJobberRouter = require('./routes/jobber');
app.use('/jobber', userJobberRouter);

const animalRouter = require('./routes/animal');
app.use('/animal', animalRouter);

const commentRouter = require('./routes/comments');
app.use('/comments', commentRouter);

const serviceRouter = require('./routes/service');
app.use('/service', serviceRouter);

const typeServiceRouter = require('./routes/typeservice');
app.use('/typeservice', typeServiceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
