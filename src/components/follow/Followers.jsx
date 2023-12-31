import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from '../user/UserList'
import { useParams } from 'react-router-dom'
import { GetProfile } from '../../helpers/GetProfile'

export const Followers = () => {
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [more, setMore] = useState(true)
    const [loading, setLoading] = useState(true)
    const [following, setFollowing] = useState([])
    const [userProfile, setUserProfile] = useState({})


    const params = useParams();

    useEffect(()=>{
       getUsers(1);
       GetProfile(params.userId, setUserProfile)
    },[])
  
  
    const getUsers = async(nextPage=1) => {

        setLoading(true)

        const userId = params.userId;

        const request = await fetch(Global.url + `follow/followers/${userId}/${nextPage}`, {
            method: 'GET',
            headers:{
            "Content-Type":"aplication/json",
            "Authorization": localStorage.getItem("token")
            }
        })
    
        const data = await request.json()
        let cleanUsers = []

        data.follows.forEach(follow => {
            cleanUsers = [...cleanUsers, follow.user]
        })

        data.users = cleanUsers
    
        if(data.users && data.status == "success") {
            let newsUsers = data.users
    
            if(users.length >= 1){
            newsUsers = [...users, ...data.users]
            }
        
            setUsers(newsUsers)
            setFollowing(data.user_following)
            setLoading(false)
    
            if(users.length >= (data.total - data.users.length)){
            setMore(false)
            }
        }
    }
  
  
    return (
      <>
        <header className="content__header">
              <h1 className="content__title">Followers of {userProfile.name} {userProfile.surname}</h1>
        </header>
          
        <UserList 
            users={users} 
            getUsers={getUsers} 
            following={following} 
            setFollowing={setFollowing}
            more = {more}
            loading={loading}
            page={page}
            setPage={setPage}
        />
      </>
    )
}
