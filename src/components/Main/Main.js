import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../Home/Home'
import Login from '../Login/Login'
import NotFound from '../NotFound/NotFound'

const Main = () => (
  <main className="wrapper">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="*" component={NotFound} />
    </Switch>
  </main>
)

export default Main
