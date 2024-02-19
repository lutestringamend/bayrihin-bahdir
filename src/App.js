import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Parse from 'parse/dist/parse.min.js';
import { DEV_PARSE_APP_ID, DEV_PARSE_JS_KEY } from './constants/parse';

import './App.css';
import "./sb-admin-2.min.css";

//import Dashboard from '../src/pages/Dashboard/Dashboard';
//import Login from '../src/pages/Auth/Login';
import Userlist from './pages/User/Userlist';
import Portal from '../src/pages/Portal/Portal';
import UserCreate from './pages/User/UserCreate';
import UserView from './pages/User/UserView';
import UserEdit from './pages/User/UserEdit';

import WarehouseMain from './pages/Warehouse/WarehouseMain';
import WarehouseProducts from './pages/Warehouse/WarehouseProducts';
import WarehouseStorages from './pages/Warehouse/WarehouseStorages';
import WarehouseTypes from './pages/Warehouse/WarehouseTypes';
import WarehouseProductMutations from './pages/Warehouse/WarehouseProductMutations';
import WarehouseProductLots from './pages/Warehouse/WarehouseProductLots';

const PARSE_APPLICATION_ID = DEV_PARSE_APP_ID;
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = DEV_PARSE_JS_KEY;
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

//<Route path='/' element={<Login />} />
//<Route path='dashboard' element={<Dashboard />} />

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Portal />} />

        <Route path='/portal' element={<Portal />}>
          
          <Route path='warehouse' element={<WarehouseMain />} />
          <Route path='warehouse-products' element={<WarehouseProducts />} />
          <Route path='warehouse-storages' element={<WarehouseStorages />} />
          <Route path='warehouse-types' element={<WarehouseTypes />} />
          <Route path='warehouse-product-mutations/:id' element={<WarehouseProductMutations />} />
          <Route path='warehouse-product-mutations/:id/:lotId' element={<WarehouseProductMutations />} />
          <Route path='warehouse-product-lots/:id' element={<WarehouseProductLots />} />

          <Route path='user-list' element={<Userlist />} />
          <Route path='create-user' element={<UserCreate />} />
          <Route path='user-view/:id' element={<UserView />} />
          <Route path='user-edit/:id' element={<UserEdit />} />

          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
