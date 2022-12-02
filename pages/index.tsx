import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Migration from '../components/Migration'
import Logo1 from "../public/goge_logo.png";
import Logo2 from "../public/goge_logo_2.png";
import Rainbow from "../public/goge_rainbow.png";

export default function Home() {
  return (
    <>
      <nav className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 goge-navbar shadow sm:items-baseline w-full">
          <div className="mb-2 sm:mb-0">
          <Image src={Logo2} className="inline" alt="MetaRaft" /><Image className="inline" src={Logo1} alt="MetaRaft" />
          </div>
          <div className="mt-5 flex flex-col items-center">
          <div className='inline-flex m-auto content-center migrate-button px-4 py-2 sm:text-sm'>Token Address</div>
      </div>
      </nav>
      <div>
        <Migration />
      </div>
    </>
  )
}
