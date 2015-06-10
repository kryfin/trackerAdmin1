
var express = require('express');
var app = module.exports = express();
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
// pie chart settings
var pie = require('./pie');

app.set('views', path.join(__dirname, 'views'));


app.get(/\/view8(?:\/(\w+))?/, function (req, res, next) {

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
    var aid = req.params[0] || '1';
res.locals.aid=aid;
    queryDatabase(db, aid, function (err, rows, total) {
        if (err) return next(err);

        // pie chart's settings


        // month's select control data
        

        next();
    });
});


app.post(/\/view8(?:\/(\w+))?/, function (req, res, next) {
    // reuse the admin's database connection
    var db = res.locals._admin.db;



    // get the month from the POST params
    var formdata = req.body;
//  var  month=7;
var j=formdata.account_id;
var k='/view5/'+j;


     queryDatabase1(db, formdata, function (err) {

        if (err) return next(err);

         next();
         res.redirect(k);
     });
});


app.all(/\/view8(?:\/(\w+))?/, function (req, res, next) {
    // console.log("i am child");
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
    var sql = "insert into tracker(tracker_imei,account_id,purchasing_date) values('"+formdata.tracker_imei+"','"+formdata.account_id+"','"+formdata.tracker_date+"')";


  db.client.query(sql, function (err, person_id) {
            if (err) return cb(err);            
            // queries results
cb(null);

     

          
        });

      
}

