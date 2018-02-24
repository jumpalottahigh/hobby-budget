import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../Home/Home'
import Stats from '../Stats/Stats'
import Charts from '../Charts/Charts'
import Login from '../Login/Login'
import NotFound from '../NotFound/NotFound'

const Main = () => (
  <main className="wrapper">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/stats" component={Stats} />
      <Route path="/charts" component={Charts} />
      <Route path="/login" component={Login} />
      <Route path="*" component={NotFound} />
    </Switch>
  </main>
)

export default Main
