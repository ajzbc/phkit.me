const express = require('express');
var cors = require('cors');
var cheerioReq = require('cheerio-req');
var admin = require('firebase-admin');
const app = express();
app.use(cors());

admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
    }),
    databaseURL: process.env.DATABASEURL
});

var db = admin.firestore();

var publicStats = db.collection('stats').doc('public');
var products = db.collection('products');

app.get('/votes/:post_id([0-9]+)', function (req, res) {
    const post_id = parseInt(req.params.post_id, 10);
    cheerioReq(`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${post_id}`, (err, $) => {
        let tspan = $('tspan').slice(2).eq(0).html();
        if (tspan) {
            res.json({
                votes: tspan
            });
            incrementAPICalls(post_id);
        } else {
            res.status(404).json({
                error: "404"
            });
            incrementAPICalls();
        }
    });
});

app.get('/getPostID/:name([A-Za-z0-9\-]+)', function (req, res) {
    const name = req.params.name;
    cheerioReq(`https://www.producthunt.com/posts/${name}/embed`, (err, $) => {
        var imgsrc = $('img').attr('src');
        if (!imgsrc) {
            res.status(404).json({
                error: "404"
            });
            incrementAPICalls();
        }
        var post_id = imgsrc.match(/\=(.*?)\&/)[1];
        res.send(post_id);
        incrementAPICalls();
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

function incrementAPICalls(id) {
    if (id) {
        var post_id = id.toString();
        products.doc(post_id).get()
            .then(doc => {
                if (!doc.exists) {
                    products.doc(post_id).set({
                        totalCalls: 1
                    })
                } else {
                    products.doc(post_id).set({
                        totalCalls: doc.data().totalCalls + 1
                    })
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
    }
    publicStats.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                publicStats.update({
                    apiCalls: doc.data().apiCalls + 1
                });
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
}