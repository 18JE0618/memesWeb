import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from "../../App"
const Profile = () => {
    const { state, dispatch } = useContext(UserContext);
    const [mypics, setMypics] = useState([]);
    useEffect(() => {
        fetch("/mypost", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(
                result => { setMypics(result.mypost) }
            )
    })
    return (
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>
            <div style={{
                display: 'flex',
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div >
                    <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                        src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDF8fHByb2ZpbGV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                        alt="img"
                    />
                </div>
                <div>
                    <h4>{state ? state.name : "loading.."}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: "112%" }}>
                        <h6>40 posts</h6>
                        <h6>40 followers</h6>
                        <h6>40 following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {mypics.map(item => {
                    return (
                        <img key={item._id} className="item" alt={item.title} src={item.photo} />
                    )
                })}
            </div>
        </div>
    )
}

export default Profile;