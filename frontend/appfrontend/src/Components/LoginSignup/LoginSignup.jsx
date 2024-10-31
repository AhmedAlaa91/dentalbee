import React, { useState, useRef, useEffect } from 'react'
import './LoginSignup.css'
import person from '../../Assets/person.png'
import password from '../../Assets/password.png'
import emailPng from '../../Assets/email.png'
import { useParams, useNavigate } from 'react-router-dom';
import {registeraNewUser} from '../../redux/actions/registerActions';
import {loginaUser} from '../../redux/actions/loginActions';
import { connect } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';

const LoginSignup = ({data , loading, error, profile, registeraNewUser, loginaUser,} ) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // useEffect(() => {
    //   // Optional: Perform actions based on the error state here (e.g., display error messages)
    // }, [error]); // Re-run effect whenever error state changes

    const [profileName, setProfileName] = useState();
  
    const { actionType } = useParams();
    const [action,setAction]= useState(actionType);

    const userNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    


    const [errorMsg, setErrorMsg] = useState(null);
    const handleSubmit = async () => {
        //setIsSubmitting(true); // Set submission state to "true"
        setIsSubmitting(true);
        setAction('SignUp');
        try {
 
          const registerDataToSubmit = {
            username: userNameRef.current.value,
            password: passwordRef.current.value,
            password2: confirmPasswordRef.current.value,
            email: emailRef.current.value,
            first_name: firstNameRef.current.value,
            last_name: lastNameRef.current.value
          };
    
          const userData = await registeraNewUser(JSON.parse(JSON.stringify(registerDataToSubmit)));
          console.log(userData);
    
          // Handle successful registration (e.g., navigate to profile)
          
          if (userData  ){  navigate('/loginsignup/Login'); setAction('login');}
        } catch (error) {
          console.error('Registration failed:', error);
          setErrorMsg(error.message);
        }  finally {
          setIsSubmitting(false); // Set submission state to "false"
        }
      };

    const handleLogin = async () => {
        setIsSubmitting(true); // Set submission state to "true"
        setAction('Login');
        try {
 
          const loginData = {
            username: userNameRef.current.value,
            password: passwordRef.current.value,
          };

          if ( userNameRef.current.value && passwordRef.current.value ){
    
          await loginaUser(JSON.parse(JSON.stringify(loginData)));
    
          // Handle successful registration (e.g., navigate to profile)
          setProfileName(userNameRef.current.value);
          const userLogged= userNameRef.current.value
          console.log(userLogged);
          navigate('/', { state: { userLogged } });
          
          }
        } catch (error) {
          console.error('Registration failed:', error);
          setErrorMsg(error.message);
        }  finally {
          setIsSubmitting(false); // Set submission state to "false"
        }
      };
      console.log(errorMsg);

  
  return (
    <div className='container'>
        <div className='header'>
            <div className='text'>{action}</div>
            <div className='underline'></div>
        </div>
        <div className='inputs'>
            <div className='input'>
                <img src ={person} alt=""/>
                <input type="text" placeholder='User Name' ref={userNameRef} />
            </div>
            <div className='input'>
                <img src ={password} alt=""/>
                <input type="password" placeholder='Password' ref={passwordRef}/>
            </div>
            {action==="SignUp"?
            <div className='input'>
                <img src ={password} alt=""/>
                <input type="password" placeholder='Confirm Password' ref={confirmPasswordRef}/>
            </div>:<div></div> }
            {action==="SignUp"?
              <div className='input'>
                <img src ={person} alt=""/>
                <input required type="text" ref={firstNameRef}  placeholder='First Name'/>
              </div>:<div></div> }
              {action==="SignUp"?
              <div className='input'>
                <img src ={person} alt=""/>
                <input required type="text" ref={lastNameRef}  placeholder='Last Name'/>
              </div>:<div></div> }
              {action==="SignUp"?
              <div className='input'>
                <img src ={emailPng} alt=""/>
                <input required ref={emailRef} type="email"  placeholder='Email'/>
              </div>:<div></div> }
                    
        </div>
        {action==="SignUp"?<div></div>: 
        <div className="forgot-password">Lost Password? <span>Click Here!</span></div>}
        
        <div className='submit-container'>
        {isSubmitting ? <ClipLoader size={50} /> : 
          <div className='submit-container'> 
            <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{handleSubmit()}} >Sign Up</div>
            <div className={action==="SignUp"?"submit gray":"submit"} onClick={()=>{ handleLogin()}}>Login</div>
            </div>
            }
        </div>

        
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </div>
  )
}



const mapStateToProps = (state) => {
    return {
      data: state.data.data,
      loading: state.data.loading,
      error: state.data.error,
      profile:state.profile.profile,
    };
  };
  
const mapDispatchToProps = {
    registeraNewUser,
    loginaUser,
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(LoginSignup);
