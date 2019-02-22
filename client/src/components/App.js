import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Header from './Header';
import Dashboard from './Dashboard';
import Landing from './Landing';
import SurveyNew from './SurveyNew';

class App extends React.Component {
  componentDidMount(){

  };
  
  render(){
    return (
      <div className="container">
        <BrowserRouter>
        <div>
            <Header />
            <Route path="/" exact component={Landing} />
            <Route path="/surveys" exact component={Dashboard} />
            <Route path="/surveys/new" component={SurveyNew} />
        </div>
        </BrowserRouter>
      </div>
    );
  };  
}

export default App;
