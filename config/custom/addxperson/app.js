
var express = require('express');
var app = module.exports = express();
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
// pie chart settings
var pie = require('./pie');

app.set('views', path.join(__dirname, 'views'));


app.get(/\/view10(?:\/(\w+))?/, function (req, res, next) {

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

    var pid = req.params[0]||'1' ;
res.locals.pid=pid;
    queryDatabase(db, pid, function (err, rows, total) {
        if (err) return next(err);

        // pie chart's settings
  res.locals.data1 =rows;

        // month's select control data
        

 

        next();
    });
});




app.post(/\/view10(?:\/(\w+))?/, function (req, res, next) {
    // reuse the admin's database connection
    var db = res.locals._admin.db;



    // get the month from the POST params
    var formdata = req.body;
//  var  month=7;


     queryDatabase1(db, formdata, function (err) {

        if (err) return next(err);

  

       next();
   res.redirect('/view2');

     });
});


app.all(/\/view10(?:\/(\w+))?/, function (req, res, next) {
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
            var rows  = items;
               // total = sum[0].total;

            cb(null, rows);
        });
    });
}

function queryDatabase1 (db, formdata, cb) {
    // find the first and last date of the selected month (all test dates are in 2012)
    // var date  = moment('2012-'+month, 'YYYY-MMMM'),
    //     first = date.startOf('month').format('YYYY-MM-DD'),
    //     last  = date.endOf('month').format('YYYY-MM-DD');
    // group by item and sum its cache for the selected month
   


   var sql = "insert into person(person_name,person_address,person_cnic,person_contact) values ('"+formdata.p_name+"','"+formdata.p_address+"','"+formdata.p_cnic+"','"+formdata.p_contact_number+"')  \
                ";

  db.client.query(sql, function (err, person_id) {
            if (err) return cb(err);            
            // queries results
cb(null);

     

          
        });

      
}

