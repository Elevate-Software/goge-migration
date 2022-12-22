import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Migration from '../components/Migration'
import Logo1 from "../public/goge_logo.png";
import Logo2 from "../public/goge_logo_2.png";
import Rainbow from "../public/rainbow.png";

export default function Home() {
  return (
    <>
      <div className='bg-white h-screen'>
        <Migration />
      </div>
    </>
  )
}
