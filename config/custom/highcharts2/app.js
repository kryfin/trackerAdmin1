
var express = require('express');
var app = module.exports = express();
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
// pie chart settings
var pie = require('./pie');

app.set('views', path.join(__dirname, 'views'));


app.get(/\/view3(?:\/(\w+))?/, function (req, res, next) {
    // reuse the admin's database connection
    var db = res.locals._admin.db;

    // get the month from the url
    var month = req.params[0] || '1';

    queryDatabase(db, month, function (err, rows, total) {
        if (err) return next(err);

        // pie chart's settings
  res.locals.data1 =rows;

        // month's select control data
        res.locals.months = getMonths(month);

 

        next();
    });
});



app.post(/\/view3(?:\/(\w+))?/, function (req, res, next) {
    // reuse the admin's database connection
    var db = res.locals._admin.db;



    // get the month from the POST params
    var formdata = req.body;
//  var  month=7;


     queryDatabase1(db, formdata, function (err) {



         if (err) return next(err);





//         // pie chart's settings
//                 // JSON.stringify(pie.chart(month, rows, total));



//res.locals.data1 =rows;


// //


// //      console.log(t);
// res.locals.months = getMonths(month);
//         // month's select control data

         next();
     });
});

// common data for each request to this view
app.all(/\/view3(?:\/(\w+))?/, function (req, res, next) {
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

function getMonths (month) {
    var months = [
        {value: '1', text: 'person1'},
        {value: '2', text: 'person2'},
        {value: '4', text: 'person3'},
        {value: '5', text: 'person4'},
        {value: '7', text: 'person5'},
        {value: '8s', text: 'person6'}
    ];
    // set the selected month
    for (var i=0; i < months.length; i++) {
        if (months[i].value === month) {
            months[i].selected = true;
            break;
        }
    }
    return months;
}

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
    var sql = "insert into person(person_name,person_address,person_cnic,person_contact) values ('"+formdata.p_name+"','"+formdata.p_address+"','"+formdata.p_cnic+"','"+formdata.p_contact_number+"')  \
                ";
    db.client.query(sql, function (err) {


  if (err) return cb(err);
        // total spend cache for this month

//        cb(null);

    });

    var sql = "select  max(person_id) as 'p_id' \
                from `person` ; ";
   


     db.client.query(sql, function (err, pidd) {
            if (err) return cb(err);
console.log(pidd);
var pid2=pidd[0].p_id;


var pass=bcrypt.hashSync(formdata.Account_Password);
     var sql = "insert into account(account_name,account_password,person_id,role_id) values ('"+formdata.Account_Name+"','"+pass+"','"+pid2+"','"+formdata.r_name+"') ";

  db.client.query(sql, function (err, person_id) {
            if (err) return cb(err);            
            // queries results

     

          
        });


var sql = "select  max(account_id) as 'a_id' \
                from `account` ; ";
db.client.query(sql, function (err, aidd) {
            if (err) return cb(err);

         //   console.log(aidd[0].a_id);

var aid2=aidd[0].a_id;


var sql = "insert into tracker(tracker_imei,account_id,purchasing_date) values('"+formdata.tracker_imei+"','"+aid2+"','"+formdata.tracker_date+"')";

 db.client.query(sql, function (err, person_id) {
            if (err) return cb(err);            
            // queries results

     
var sql = "select  max(tracker_id) as 't_id' \
                from `tracker`;";
db.client.query(sql, function (err, tidd) {
            if (err) return cb(err);

var tid2=tidd[0].t_id;


var sql = "insert into tracker_data(tracker_id1) values('"+tid2+"')";

 db.client.query(sql, function (err, person_id) {
            if (err) return cb(err);            
            // queries results

     

          
        });

cb(null);

          
});




          
        });


//cb(null);

          
});

      // cb(null);   
});
   



      
}

