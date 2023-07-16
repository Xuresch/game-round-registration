import Menu from '@/components/menu';

import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return  (
    <>
      <Menu />
      <div className='conntent'>
        <Component {...pageProps} />
      </div>
    </>
  )
}
