
import './App.css'
import { RouterProvider } from 'react-router-dom';
import { routes } from '@/app/router/Route';
import { Provider } from 'react-redux';
import AppInit from './app/init/AppInit';
import { store } from './app/redux/store';
function App() {
 return (
    <Provider store={store}>
    <AppInit>
      <RouterProvider router={routes} />
    </AppInit>
    </Provider>
  )
}

export default App