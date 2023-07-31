import Menu from '@/components/menu';

import '@/styles/globals.css'

function App({ Component, pageProps }) {
  return  (
    <>
      <Menu />
      <div className='conntent'>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default App
