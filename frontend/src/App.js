import './App.css';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import Homepage from './pages/Homepage';
import ChatPage from './pages/Chatpage';
function App() {
  return (
    <div className="App">
      <Route path='/'  component={Homepage} exact/>
      <Route path='/chats' component={ChatPage} exact/>
    </div>
  );
}

export default App;
