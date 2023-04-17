import { request } from './formatTime';

const requests = {
  async getProfile() {
    const req = {
      method: 'get',
      path: `/user`,
    };
    const profile = await request(req);
    return profile.data.data.stats || {};
  },
  async createFaculty(name) {
    const req = {
      method: 'post',
      path: `/faculties`,
      data: {
        name,
      },
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async getFaculties(){
    const req = {
      method: 'get',
      path: `/faculties/user`,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async getFaculty(id) {
    const req = {
      method: 'get',
      path: `/faculties/${id}`,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async deleteFaculty(id) {
    const req = {
      method: 'delete',
      path: `/faculties/${id}`,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200 };
  },
  async deleteDept(id) {
    const req = {
      method: 'delete',
      path: `/departments/${id}`,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200 };
  },
  async createDept(body) {
    const req = {
      method: 'post',
      path: `/departments`,
      data: body,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async createElection(title) {
    const req = {
      method: 'post',
      path: `/poll`,
      data: {
        title,
      },
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async createContestant(body) {
    const req = {
      method: 'post',
      path: `/contestants`,
      data: body,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async deleteContestant(id) {
    const req = {
      method: 'delete',
      path: `/contestants/${id}`,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async getElection(id) {
    const req = {
      method: 'get',
      path: `/poll/${id}`,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async getElectionTip(id) {
    const req = {
      method: 'get',
      path: `/poll/tip/${id}`,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async updateElection(body) {
    const req = {
      method: 'put',
      path: `/poll/${body.pollId}`,
      data: body,
    };
    const faculty = await request(req);
    return { status: faculty.status === 200, data: faculty?.data?.data };
  },
  async createSubElection(title, type, relatedId, pollId) {
    const payload = {
      title,
      visibility: type,
      relatedId,
      pollId,
    };
    const req = {
      method: 'post',
      path: `/subPoll`,
      data: payload,
    };
    const poll = await request(req);
    return { status: poll.status === 200, data: poll?.data?.data };
  },
  async getSubElection(id) {
    const req = {
      method: 'get',
      path: `/subPoll/${id}`,
    };
    const res = await request(req);
    return { status: res.status === 200, data: res?.data?.data };
  },
  async deleteSubElection(id) {
    const req = {
      method: 'delete',
      path: `/subPoll/${id}`,
    };
    const res = await request(req);
    return { status: res.status === 200, data: res?.data?.data };
  },
  async verifyEmail(email){
    const req = {
      method: 'post',
      path: `/voters/validateEmail`,
      data: {
        email
      }
    };
    const res = await request(req);
    return { status: res.status === 200, data: res?.data?.message };
  },
  async tipOtp(otp){
    const req = {
      method: 'get',
      path: `/otp/tip/${otp}`,
    };
    const res = await request(req);
    return { status: res.status === 200, data: res?.data?.data };
  },
  async accreditUser(body){
    const req = {
      method: 'post',
      path: `/voters/accredit`,
      data: body
    };
    const res = await request(req);
    return { status: res.status === 200, data: res?.data };
  },
  async getVoterPolls(){
    const req = {
      method: 'get',
      path: `/voters/polls`,
      voter: true,
    };
    const res = await request(req);
    return { status: res.status === 200, data: res?.data?.data };
  },
  async getResults(id){
    const req = {
      method: 'get',
      path: `/results/poll/${id}`,
    };
    const res = await request(req);
    return { status: res.status === 200, data: res?.data };
  },
  async vote(body){
    const req = {
      method: 'post',
      path: `/vote`,
      data: body,
      voter: true,
    };
    const res = await request(req);
    return { status: res.status === 200, data: res?.data };
  },
};
export default requests;
