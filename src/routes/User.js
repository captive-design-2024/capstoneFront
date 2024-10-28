import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const defaultTheme = createTheme();
const baseAddress = "http://localhost:3000";

export default function User() {
  const [name, setUserName] = useState('');
  const [id, setUserId] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 상태
  const [newPassword, setNewPassword] = useState(''); // 변경할 비밀번호 상태
  const [email, setUserEmail] = useState('');
  const [phone_number, setUserPhone] = useState('');
  const [, setProjectTitle] = useState([]); // 프로젝트 제목 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${baseAddress}/user/value`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setUserId(response.data[0].id);
        setUserName(response.data[0].name);
        setUserEmail(response.data[0].email);
        setUserPhone(response.data[0].phone);
      } catch (error) {
        console.error('유저 데이터를 가져오는 중 에러 발생:', error);
      }
    };

    const fetchProjectTitle = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${baseAddress}/project/title`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        console.log('프로젝트 제목 응답:', response.data);
        setProjectTitle(response.data.projectNames);
      } catch (error) {
        console.error('프로젝트 제목을 가져오는 중 에러 발생:', error);
      }
    };

    fetchUserData();
    fetchProjectTitle();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      user_id: id,
      current_password: currentPassword, // 현재 비밀번호 추가
      new_password: newPassword, // 변경할 비밀번호 추가
      user_name: name,
      user_email: email,
      user_phone: phone_number,
    };

    console.log('회원정보 수정 시도:', formData);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${baseAddress}/user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('서버 응답:', response.data);
      alert('회원정보 수정 성공!');
      navigate('/mypage');
    } catch (error) {
      const errorMessage = error.response?.data?.message || '회원정보 수정 실패. 다시 시도해 주세요.';
      console.error('에러 발생:', error.response?.data);
      alert(errorMessage);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth={false} sx={{ height: '100vh' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            회원정보 수정
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="이름"
                  value={name}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="id"
                  label="아이디"
                  value={id}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="현재 비밀번호"
                  type="password" // 비밀번호 입력 필드
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="변경할 비밀번호"
                  type="password" // 비밀번호 입력 필드
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="이메일"
                  value={email}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="전화번호"
                  value={phone_number}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              수정하기
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
