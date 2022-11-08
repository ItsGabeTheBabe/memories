import React, { useState } from "react";
import { Avatar, Button, Paper, Grid, Typography, Container } from "@material-ui/core";
import { GoogleLogin } from '@react-oauth/google'
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import jwt_decode from 'jwt-decode'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Input from "./Input";
import Icon from './icon'
import useStyles from './styles'
import { signin, signup } from '../../actions/auth'

const initalState = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }

const Auth = () => {
    const classes = useStyles()
    const [showPassword, setShowPassword] = useState(false)
    const [isSignup, setSignUp] = useState(false)
    const [formData, setFormData] = useState(initalState)
    const dispatch = useDispatch()
    const history = useHistory()
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)
    const handleSubmit = (e) => {
        e.preventDefault()
        if (isSignup) {
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))
        }
    }
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const switchMode = () => {
        setSignUp((prev) => !prev)
        setShowPassword(false)
    }

    const googleSuccess = async (res) => {
        console.log(res)
        const result =  jwt_decode(res.credential)
        const token =  res.credential

        try {
            dispatch({type: 'AUTH', data: {result, token} })
            history.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    const googleFailure = (error) => {
        console.log(error)
        console.log('Google Sign In was unsuccessful. Try Again Later')
    }

    return ( 
        <Container component='main' maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignup && (
                            <>
                                <Input name="firstName" label='First Name' handleChange={handleChange} half />
                                <Input name="lastName" label='Last Name' handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label='Email Address' handleChange={handleChange} type='email'/>
                        <Input name="password" label='Password' handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
                        {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type='password' />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin
                    render={(renderProps) => (
                        <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} vairant="contained">
                            Google Sign In
                        </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an acoount? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
     );
}
 
export default Auth;