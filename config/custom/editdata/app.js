
var express = require('express');
var app = module.exports = express();
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
// pie chart settings
var pie = require('./pie');

app.set('views', path.join(__dirname, 'views'));


app.get('/viewEditData/:routes', function (req, res, next) {

  var relative = path.relative(res.locals._admin.views, app.get('views'));

    res.locals.breadcrumbs = {
        links: [
            {url: '/', text: res.locals.string.home},
            {active: true, text: 'Result'}
        ]
    };
    
    res.locals.partials = {

        content: path.join(relative, 'form'),
        readme:  path.join(relative, 'readme')
    
    };



    // reuse the admin's database connection
    var db = res.locals._admin.db;

    // get the month from the url

 var pid = req.params.routes.split(',');
res.locals.tid=pid[1];
res.locals.tdid=pid[0];
    queryDatabase(db, pid[1], function (err, rows, total) {
        if (err) return next(err);

        // pie chart's settings
  res.locals.data1 =rows;

        // month's select control data
        

 

        next();
    });
});




app.post(/\/viewEditData(?:\/(\w+))?/, function (req, res, next) {
    // reuse the admin's database connection
    var db = res.locals._admin.db;



    // get the month from the POST params
    var formdata = req.body;
//  var  month=7;

var j=formdata.tracker_id2;
var k='/view6/'+j;

     queryDatabase1(db, formdata, function (err) {

        if (err) return next(err);

  

       next();
   res.redirect(k);

     });
});


app.all(/\/viewEditData(?:\/(\w+))?/, function (req, res, next) {
    console.log("i am child");
    var relative = path.relative(res.locals._admin.views, app.get('views'));

    res.locals.breadcrumbs = {
        links: [
            {url: '/', text: res.locals.string.home},
            {active: true, text: 'Result'}
        ]
    };
    
    res.locals.partials = {

        content: path.join(relative, 'form'),
        readme:  path.join(relative, 'readme')
    
    };

    next();
});









function queryDatabase (db, month, cb) {
    // find the first and last date of the selected month (all test dates are in 2012)
    // var date  = moment('2012-'+month, 'YYYY-MMMM'),
    //     first = date.startOf('month').format('YYYY-MM-DD'),
    //     last  = date.endOf('month').format('YYYY-MM-DD');
    // group by item and sum its cache for the selected month
    var sql = "select *  \
                from `person` \
               where `person_id` = '"+month+"' ";
    db.client.query(sql, function (err, items) {
        if (err) return cb(err);
        // total spend cache for this month
        var sql = "select 'account_name' as 't'\
                    from `account`;";
        db.client.query(sql, function (err, sum) {
            if (err) return cb(err);
            
            // queries results
            var rows  = items,
                total = sum[0].total;

            cb(null, rows, total);
        });
    });
}

function queryDatabase1 (db, formdata, cb) {
    // find the first and last date of the selected month (all test dates are in 2012)
    // var date  = moment('2012-'+month, 'YYYY-MMMM'),
    //     first = date.startOf('month').format('YYYY-MM-DD'),
    //     last  = date.endOf('month').format('YYYY-MM-DD');
    // group by item and sum its cache for the selected month
   


var pass=bcrypt.hashSync(formdata.Account_Password);

   var sql = "update tracker_data set tracker_data_location='"+formdata.tracker_loc+"',tracker_data_history='"+formdata.tracker_his+"', tracker_id1='"+formdata.tracker_id2+"' \
where `tracker_data_id` = '"+formdata.data_id+"' ";
  db.client.query(sql, function (err, person_id) {
            if (err) return cb(err);            
            // queries results
cb(null);

     

          
        });

      
}

