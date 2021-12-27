import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import factory from '../ethereum/factory'

export default function Home() {
  const [campaigns,setCampaigns]=useState([])
  useEffect(()=>{
     const fetchCampaigns=async()=>{
      const campaignsArray=await factory.methods.getDeployedCampaigns().call()
      setCampaigns(campaignsArray)
     }
     fetchCampaigns()
    
  },[])
  return (
    <div className={styles.container}>
     {campaigns[0]}
    </div>
  )
}
