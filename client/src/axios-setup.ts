import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.defaults.headers.common["Access-Control-Allow-Methods"] = 'POST, GET, OPTIONS, PUT, DELETE';
$api.defaults.headers.common["Access-Control-Allow-Headers"] = 'Content-Type, Origin, Authorization';

export default $api;