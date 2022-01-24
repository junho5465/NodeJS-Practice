//생성자 함수
function Member(userId, userName){
    this.userId = userId;
    this.userName = userName;
}
Member.prototype.printMember = function(){
    console.log('member 아이디 : %s, member 이름 : %s', this.userId, this.userName);
}
module.exports = new Member('conan', '코난');