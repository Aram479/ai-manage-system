import { Random } from 'mockjs';
import express from 'express';

const router = express.Router();
router.get('/', (req, res) => {
  let { callback } = req.query;
  let data = Random.cname();
  res.send(callback + `(${data})`);
}).get('/song', (req, res) => {
  console.log(req.headers, 'req');
  res.json(123);
}).get('/get', (req, res) => {
  res.send([req.query, req.headers, req.body]);
}).post('/post', (req, res) => {
  res.send([req.query, req.headers, req.body]);
});

module.exports = router;
