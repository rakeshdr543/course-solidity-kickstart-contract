import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import factory from '../ethereum/factory'
import { Button, Icon } from 'semantic-ui-react'

export default function Home() {
  const [campaigns,setCampaigns]=useState([])
  useEffect(()=>{
     const fetchCampaigns=async()=>{
      const campaignsArray=await factory.methods.getDeployedCampaigns().call()
      setCampaigns(campaignsArray)
     }
     fetchCampaigns()
    
  },[])
const comp=  {
  header: 'Project Report - April',
  description:
    'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
  meta: 'ROI: 30%',
}

  return (
    <div className={styles.container}>
     {campaigns[0]}
     <Button icon labelPosition='left'>
      <Icon name='pause' />
      Pause
    </Button>
    </div>
  )
}
