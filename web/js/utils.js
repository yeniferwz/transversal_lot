/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const buttonAudio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
function play(){
    buttonAudio.play();
}

Vue.component('routes', {
    template: ` <div class="nav-container">
                    <b-nav class="navbar">
                        <b-nav-item v-show="this.isLogged" to="/ranking">RANKING</b-nav-item>
                        <b-nav-item active to="/">HOME</b-nav-item>
                        <b-nav-item v-show="this.isLogged" :to="'/profile/' + this.userLogged.idUser">PROFILE</b-nav-item>
                        <b-nav-item v-show="!this.isLogged" to="/join">LOG IN</b-nav-item>
                    </b-nav>
                </div>`,
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        }
    }
});

Vue.component('record', {
    props: ['id', 'name'],
    data: function(){
        return{
            gamesPlayed: [],
            externProfile: false
        }
    },
    template: ` <div class="nav-container">
                    <div class="record__outerDiv">
                        <div class="record__div">
                            <b-card header="Results" class="record__header">
                                <div v-for="(game, index) in gamesPlayed">
                                    <b-card-text class="record_cardTexts">
                                        <div class="record__selection" style="display:inline-block;">
                                                <div v-if="game.difficulty=='easy'">
                                                    <h1 style="color:#86a83a;">EASY</h1>
                                                </div>
                                                <div v-if="game.difficulty=='medium'">
                                                    <h1 style="color:#daa759;">MEDIUM</h1>
                                                </div>
                                                <div v-if="game.difficulty=='hard'">
                                                    <h1 style="color:#d25353;">HARD</h1>
                                                </div>
                                                <div class="record__diffDiv">
                                                    <h4>{{game.category}}</h4>
                                                </div> <br>
                                                <div>
                                                    <h3> Score: <span style="color:#d25353;">{{game.score}}</span></h3>
                                                </div>
                                                <div>
                                                    Date: {{game.created_at}}
                                                </div>    
                                        </div>
                                        <b-button v-if="externProfile" variant="outline-primary" style="float:right;margin-top:25px;" @click="playChallenge(game.id, game.idUser, game.score, game)">PLAY</b-button>
                                    </b-card-text>
                                    <hr>
                                </div>
                            </b-card>
                        </div>
                    </div>
                </div>`,
    methods: {
        chargeRecord: function() {
            console.log("hola id " + this.id);
            fetch("../trivial5/public/record/"+ this.id +"")
                .then(res => res.json())
                .then(data => {
                    console.log("json" + data[0]);
                    console.log(data);
                    this.gamesPlayed = data;
                    if(this.id == userStore().loginInfo.idUser){
                        this.externProfile = false;
                    }
                    else {
                        this.externProfile = true;
                    }
            });
        },
        playChallenge: function(idGame, idChallenger, scoreChallenger) {
            
            // userStore().idChallenge = id;
            // userStore().playChallenge = true;
            userStore().challengeInfo.idGame = idGame;
            userStore().challengeInfo.idChallenger = idChallenger;
            userStore().challengeInfo.score_challenger = scoreChallenger;
            userStore().challengeInfo.idChallenged = userStore().loginInfo.idUser;
            userStore().challengeInfo.score_challenged = 0;
            userStore().challengeInfo.nameChallenger = this.name;
            userStore().challenged = true;
            
            router.push("/");
        }
    },
    mounted() {
       this.chargeRecord();
    },
    watch: {
        // whenever question changes, this function will run
        id(newID, oldID) {
          console.log("change id record");
          this.chargeRecord();
        }
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        }
    },
});

Vue.component('challenges', {
    data: function(){
        return{
            challengesPending: [],
            withChallenges: false
        }
    },
    template: ` <div class="nav-container">
                    <div class="challenge__outDiv">
                        <div class="challenge__div">
                            <p>CHALLENGE LIST</p>
                            <div v-if="withChallenges" v-for="(challenge, index) in challengesPending">
                                <b-card class="mb-3 friend__list">
                                    <b-card-text class="friends__cardtext">
                                        <b-avatar variant="primary" class="mr-3" size="4rem" src="https://placekitten.com/300/300"></b-avatar>
                                        <RouterLink :to="'/profile/'+challenge.id"> {{challenge.name}} </RouterLink>
                                        <i class="fa fa-times-circle" style="font-size:24px;color:red;float:right;padding-top:20px;padding-left:10px; cursor:pointer;" @click="changeChallengeRequest('rejected', challenge.idChallenger, challenge.idChallenged, challenge.idGame, challenge.scoreChallenger, challenge.name)"></i> 
                                        <i class="fa fa-check-circle" style="font-size:24px;color:green;float:right;padding-top:20px;cursor:pointer;" @click="changeChallengeRequest('accepted', challenge.idChallenger, challenge.idChallenged, challenge.idGame, challenge.scoreChallenger, challenge.name)"></i>
                                    </b-card-text>
                                </b-card>
                            </div>
                            <div v-if="withChallenges === false">
                                <b-card class="mb-3" class="friends__noPendingText">
                                    <b-card-text>
                                        No challenges
                                    </b-card-text>
                                </b-card>
                            </div>
                        </div>
                    </div>
                </div>`,
    methods: {
        changeChallengeRequest: function(status, idChallenger, idChallenged, idGame, scoreChallenger, nameChallenger) {

            challengeRequest = new FormData();
            challengeRequest.append('status', status);
            challengeRequest.append('idChallenged', idChallenged);
            challengeRequest.append('idChallenger', idChallenger);
            challengeRequest.append('idGame', idGame);

            fetch('../trivial5/public/updatechallengestatus', {
                method: 'POST',
                headers: {"Accept": "application/json"},
                body: challengeRequest
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let borrar = 0;
                for (let i = 0; i < this.challengesPending.length; i++) {
                    console.log(this.challengesPending[i].idChallenged + " idChallenged");
                    if(this.challengesPending[i].idChallenged == idChallenged) {
                        borrar = i;
                    }
                }
                console.log("antes de " + borrar + " " + this.challengesPending);
                this.challengesPending.splice(borrar, 1); 
                console.log("despues de " + borrar + " " + this.challengesPending);

                if(this.challengesPending.length = 0) {
                    this.withChallenges = false;
                }
            }); 

            if(status == "accepted"){
                userStore().challengeInfo.idGame = idGame;
                userStore().challengeInfo.idChallenger = idChallenger;
                userStore().challengeInfo.score_challenger = scoreChallenger;
                userStore().challengeInfo.idChallenged = idChallenged;
                userStore().challengeInfo.score_challenged = 0;
                userStore().challengeInfo.nameChallenger = nameChallenger;
                userStore().challenged = true;
                
                router.push("/");
            }

        }
    },
    beforeMount() {
        console.log("fetch indexchallenge");
        fetch('../trivial5/public/indexpending/' + userStore().loginInfo.idUser)
        .then(res => res.json())
        .then(data => {
            console.log("IC " + data);
            if(data == "no hay challenges") {
                this.withChallenges = false;
            }
            else {
                this.challengesPending = data;
                this.withChallenges = true;
            }
            
        }); 
    }
});

Vue.component('list_friends', {
    data: function(){
        return{
            friends: [],
            withFriends: false,
        }
    },
    template:`  <div class="nav-container">
                    <div class="friend__outerListDiv">
                        <div class="friend__listDivBackground">
                            <div class="friend__listDiv">
                                <send_friend_request></send_friend_request><br>
                                <p>Friend list</p>
                                <div v-if="withFriends === true" v-for="(friend, index) in friends">
                                    <b-card class="mb-3 friend__list">
                                        <b-card-text class="friends__cardtext">
                                            <b-avatar variant="primary" class="mr-3" size="4rem" src="https://placekitten.com/300/300"></b-avatar>
                                            <RouterLink :to="'/profile/'+friend.id">{{friend.name}}</RouterLink>
                                            <div class="friend__listButton">
                                                <b-button variant="danger" class="button__delete" @click="deleteFriend(friend.idUserRequested, friend.idUserRequest)">Delete</b-button>
                                            </div>
                                        </b-card-text>
                                    </b-card>
                                </div>
                                <div v-if="withFriends === false">
                                    <b-card class="mb-3" class="friends__noPendingText">
                                        <b-card-text>
                                            No friends
                                        </b-card-text>
                                    </b-card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    methods: {
        deleteFriend: function(idUserRequested, idUserRequest) {
            deleteF = new FormData();
            deleteF.append('idUserRequest', idUserRequest);
            deleteF.append('idUserRequested', idUserRequested);

            fetch('../trivial5/public/deletefriend', {
                method: 'POST',
                headers: {"Accept": "application/json"},
                body: deleteF
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let borrar = 0;
                for (let i = 0; i < this.friends.length; i++) {
                    console.log(this.friends[i].idUserRequested + " idUserRequested");
                    if(this.friends[i].idUserRequested == idUserRequested) {
                        borrar = i;
                    }
                }
                console.log("antes de " + borrar + " " + this.friends);
                this.friends.splice(borrar, 1); 
                console.log("despues de " + borrar + " " + this.friends);
            }); 
            
        },
        // showUser(userId){
        //     fetch('../trivial5/public/indexPerfil/'+this.friend.id)
        //     .then(res=>res.json())
        //     .then(data=>{
        //         console.log(data);
                
        //     })
        // }
    },
    beforeMount() {
        fetch('../trivial5/public/listfriends/' + userStore().loginInfo.idUser,{
            headers:{"Accept":"application/json"},
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data != "sin amigos") {
                console.log("tiene amigos");
                this.friends = data;
                this.withFriends = true;
            }else{
                this.withFriends = false;
                console.log(this.withFriends);
            }
        }); 
    }

});

Vue.component('pending_requests', {
    data: function(){
        return{
            requests: [],
            withRequests: false,
        }
    },
    template:`  <div class="nav-container">
                    <div class="game__outerPendingDiv">
                        <div class="game__pendingDiv">
                            <div v-if="withRequests" v-for="(request, index) in requests">
                                <b-card class="mb-3 friends__pendinglist">
                                    <b-card-text class="friends__pendingCardText">
                                        {{request.name}} 
                                        <div class="friends__pendingSelections">
                                            <i class="fa fa-times-circle" style="font-size:24px;color:red" @click="changeStatusRequest('rejected', request.idUserRequest)"></i> 
                                            <i class="fa fa-check-circle" style="font-size:24px;color:green" @click="changeStatusRequest('accepted', request.idUserRequest)"></i>
                                        </div>
                                    </b-card-text>
                                </b-card>
                            </div>
                            <div v-if="!withRequests">
                                <b-card class="mb-3" class="friends__noPendingText">
                                    <b-card-text>
                                        No pending requests
                                    </b-card-text>
                                </b-card>
                            </div>
                        </div>
                    </div>
                </div>`,
    methods: {
        changeStatusRequest: function (status, idUserRequested) {

            console.log(status + " " + idUserRequested);
            console.log("entra fetch");
            changeRequestStatus = new FormData();
            changeRequestStatus.append('idUserRequested', userStore().loginInfo.idUser);
            changeRequestStatus.append('idUserRequest', idUserRequested);
            changeRequestStatus.append('status', status);

            fetch('../trivial5/public/changerequeststatus', {
                method: 'POST',
                headers: {"Accept": "application/json"},
                body: changeRequestStatus
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let borrar = 0;
                for (let i = 0; i < this.requests.length; i++) {
                    console.log(this.requests[i].idUserRequested + " idUserRequested");
                    if(this.requests[i].idUserRequested == idUserRequested) {
                        borrar = i;
                    }
                }
                console.log("antes de " + borrar + " " + this.requests);
                this.requests.splice(borrar, 1); 
                console.log("despues de " + borrar + " " + this.requests);
                if(status == "accepted"){
                    this.$emit('actualizarFriendsList'); 
                }
            }); 

        },
    },
    beforeMount() {
        fetch('../trivial5/public/pendingrequest/' + userStore().loginInfo.idUser)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data != "no existing requests") {
                this.requests = data;
                console.log("hay peticiones")
                this.withRequests = true;
            }
            else {
                console.log("no hay peticiones")
                this.withRequests = false;
            }
            
        }); 
    }

});

Vue.component('send_friend_request', {
    data: function(){
        return{
            email: "",
            mailValido: true,
            mssgIncorrecto: "",
            sendRequestAccepted: 2,
            emailRegex: new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
        }
    },
    //hacer verificacion mail para agregar
    template: ` <div class="nav-container">
                    <br>
                    <b-input-group class="mt-3">
                        <b-form-input placeholder="Enter a friend's email" v-model="email" class="friend__requestInput"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="danger" @click="validarEmail" class="friend__requestButton"><p>+</p></b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <p v-if="!mailValido" style="color:red;">*Email address incorrect</p>
                    <p v-if="sendRequestAccepted == 0" style="color:red;">*{{mssgIncorrecto}}</p>
                    <p v-if="sendRequestAccepted == 1" style="color:green;">Friend request correctly sent</p>
                </div>`,
    methods: {
        validarEmail: function() {
            if(this.emailRegex.test(this.email)) {
                this.mailValido = true;
                this.sendRequest();
            }
            else {
                this.mailValido = false;
            }
        },
        sendRequest: function() { 
            //hacer fetch al back enviandole el email para que se cree la peticion
            friendRequest = new FormData();
            friendRequest.append('id', userStore().loginInfo.idUser);
            friendRequest.append('email', this.email);

            fetch('../trivial5/public/sendfriend', {
                method: 'POST',
                headers: {"Accept": "application/json"},
                body: friendRequest
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.data);
                this.sendRequestAccepted = data.data;
                this.mssgIncorrecto = data.message;
                console.log("accepted " +this.sendRequestAccepted );
            }); 

        }
    }
});

Vue.component('friends', {
    template: ` <div class="nav-container">
                    <b-tabs pills card content-class="mt-3" align="center" active-nav-item-class="font-weight-bold text-danger">
                        <b-tab title="List" active><list_friends></list_friends></b-tab>
                        <b-tab title="Pending"><pending_requests></pending_requests></b-tab>
                    </b-tabs>
                </div>`,
    methods: {
    }
});

Vue.component('profile', {
    data: function(){
        return{
            infoUser: "",
            id: this.$route.params.id,
        }
    },
    template: ` <div v-show="this.isLogged">
                    <br>
                    <br>
                    <div class="profile__div">
                        <div class="profile__picture">
                            <b-avatar badge-variant="info" badge-offset="-0.5em" size="6rem" src="https://placekitten.com/300/300">
                                <template #badge>
                                    <div class="profile__editOptions">
                                        <b-button @onclick="editProfile" class="rounded-circle profile__editButton" size="sm">
                                            <b-icon icon="pencil"></b-icon>
                                        </b-button>
                                    </div>
                                </template>
                            </b-avatar>
                        </div>
                        <br>
                        <p class="profile__userName">{{infoUser.name}}</p>
                        <p style="font-size:18px;color:#eaeaeb!important;">{{infoUser.email}}</p>
                        <p class="profile__userScore">Total Score: {{infoUser.total_score}}</p>
                        <b-button v-if="this.id == this.userLogged.idUser" @click="logoutUser" class="profile__logoutButton">Logout</b-button>
                    </div>
                    <br>
                    <b-tabs pills card content-class="mt-3" align="center" active-nav-item-class="font-weight-bold text-danger">
                        <b-tab active >
                            <template slot="title">
                                <b-icon icon="award"></b-icon> Records
                            </template>
                            <record :id=this.id :name=infoUser.name></record>
                        </b-tab>
                        <b-tab v-if="this.id == this.userLogged.idUser" >
                            <template slot="title">
                                <b-icon icon="trophy"></b-icon> Challenges
                            </template>
                            <challenges></challenges>
                        </b-tab>
                        <b-tab v-if="this.id == this.userLogged.idUser">
                            <template slot="title">
                                <b-icon icon="person-lines-fill"></b-icon> Friends
                            </template>
                            <friends></friends>
                        </b-tab>
                    </b-tabs>
                </div>`, 
    methods: {
        editProfile:function(){
            alert("edit clicked")
        },
        logoutUser: function() {
            userStore().logged = false;
            router.push("/");
        },
        chargeProfile: function() {
            console.log("id ruta " + this.$route.params.id + " | id " + this.id);

            this.id = this.$route.params.id;

            fetch('../trivial5/public/indexPerfil/' + this.id)
            .then(res=>res.json())
            .then(data=>{
                console.log(data[0]);
                this.infoUser = data[0];
            });

        }
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        }
    },
    // beforeUpdate() {
    //     console.log("id ruta update " + this.$route.params.id + " | id " + this.id);

    //     this.id = this.$route.params.id;

    //     fetch('../trivial5/public/indexPerfil/' + this.id)
    //     .then(res=>res.json())
    //     .then(data=>{
    //         console.log(data[0]);
    //         this.infoUser = data[0];
    //     });
    // },
    mounted() {

        this.chargeProfile();

        // console.log("id ruta " + this.$route.params.id + " | id " + this.id);

        // this.id = this.$route.params.id;

        // fetch('../trivial5/public/indexPerfil/' + this.id)
        // .then(res=>res.json())
        // .then(data=>{
        //     console.log(data[0]);
        //     this.infoUser = data[0];
        // });

       
        // let userStatistics = new CharacterData("userStatistics",{
        //     type:'doughnut',
        //     data:statisticsData,
        //     options:{}
        // })
        // router.push("/");
                
    },
    watch:{
        
        $route (to, from){
            console.log("ruta cambiada");
            this.chargeProfile();
            this.show = false;
        }
    },
});

Vue.component('daily', {
    template: ` <div>
                    <p style="color:white">Esta es la partida diaria</p>
                </div>`, 
});

Vue.component('join', {
    template: ` <div class="nav-container">
                    <br><br>
                    <b-tabs pills card content-class="mt-3" align="center">
                        <b-tab title="Login" active active title-item-class="w-25 login__tab" id="login"><br><login></login></b-tab>
                        <b-tab title="Register" title-item-class="w-25 register__tab"><br><register></register></b-tab>
                    </b-tabs>
                </div>`,
})

Vue.component('register', {
    data: function(){
        return{
            form: {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
            registerCorrect: false,
            fetchReceivedMessage:"",
            emailRegex : new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}'),
            validEmail:true,
            validUsername:true,
            validPassword:true,
            validConfirmPassword:true,
            samePassword:true
        }
    },
    template:`
            <div class="register__center">
                <div class="register__card">
                    <br><br><h3 class="form__title">Register</h3>
                    <div class="register__content">
                            <div class="register__innerContent">
                                <div @keyup.enter="submitRegister">
                                    <div class="input__field">
                                        <b-icon icon="person-fill" class="input__icon"></b-icon>
                                        <input type="text" class="input__text" v-model="form.username" placeholder="Username" required>
                                        <p v-if = "validUsername===false" class="errorsFields">*Username null</p>
                                    </div>
                                    
                                    <div class="input__field">
                                        <b-icon icon="envelope" class="input__icon"></b-icon>
                                        <input type="email" class="input__text" v-model="form.email" placeholder="Email" required></input>
                                        <p v-if = "validEmail===false" class="errorsFields">*Email should contains @ with a domain</p>
                                    </div>
                                    
                                    <div class="input__field">
                                        <b-icon icon="lock" class="input__icon"></b-icon>
                                        <input type="password" class="input__text" v-model="form.password" placeholder="Password" required></input>
                                        <p v-if = "validPassword===false" class="errorsFields">*Password null</p>
                                    </div>
                                    
                                    <div class="input__field">
                                        <b-icon icon="shield-lock" class="input__icon"></b-icon>
                                        <input type="password" class="input__text" v-model="form.confirmPassword" placeholder="Comfirm password" required></input>
                                        <p v-if = "validConfirmPassword === false" class="errorsFields">*Pasword confirmation null</p><br>
                                        <p v-if = "samePassword ===false" class="errorsFields">*Confirm password is not the same as password</p>
                                    </div>

                                    <b-button @click="everythingValids" class="register__button1">Register</b-button><br><br>

                                    <p v-if="this.registerCorrect === true"  style="color:green;">Thank you for your registration {{this.form.username}}</p>
                                    <p v-if="this.registerCorrect === false" style="color:red;">{{this.fetchReceivedMessage}}</p>
                                </div>
                            </div>
                    </div>
                </div>
                
            </div>`
            ,
    methods: {
        everythingValids:function(){
            this.emailRegex.test(this.form.email)?this.validEmail = true:this.validEmail=false;
            this.form.username!=""?this.validUsername=true:this.validUsername=false;
            this.form.password != ""?this.validPassword=true:this.validPassword=false;
            this.form.confirmPassword != ""?this.validConfirmPassword = true:this.validConfirmPassword=false;
            this.form.confirmPassword === this.form.password?this.samePassword=true:this.samePassword=false;
            if(this.validEmail==true&&this.validUsername==true&&this.validPassword==true&&this.validConfirmPassword == true&&this.samePassword==true){
                this.submitRegister();
            }
        },
        submitRegister: function(){
            console.log("hola register");
            console.log("valido");
            let userRegister = new FormData();
            userRegister.append('name', this.form.username);
            userRegister.append('email', this.form.email);
            userRegister.append('password', this.form.password);
            userRegister.append('password_confirmation', this.form.confirmPassword);

            fetch('../trivial5/public/api/register2', {
                method: 'POST',
                headers: {"Accept": "application/json"},
                body: userRegister
            })
            .then(res=>res.json())
            .then(data=>{
                console.log(data.value);
                console.log(data.message);
                if(data.value == 1) {
                    this.fetchReceivedMessage = "";
                    this.registerCorrect = true;
                }
                else {
                    console.log("no deberia")
                    this.registerCorrect = false;
                    this.fetchReceivedMessage = "*" + data.message;
                }
                console.log(data.value);
                console.log(this.fetchReceivedMessage);
            });
            
        },
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        },

    },
});

Vue.component('login', {
    data: function(){
        return{
            form: {
                email: '',
                password: ''
            },
            emailRegex : new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}'),
            processing:false,
            credentialsIncorrect: false,
            validLoginEmail:true,
            validLoginEmailDomain:true,
            validLoginPassword:true,
        }
    },
    template:`
        <div class="register__center">
            <div class="register__card">
                <br><br><h3 class="form__title">Log in</h3>
                <div class="register__content">
                    <div class="register__innerContent">
                        <div @keyup.enter="submitLogin">
                            <div class="input__field">
                                    <b-icon icon="envelope" class="input__icon"></b-icon>
                                <input type="email" class="input__text" v-model="form.email" placeholder="Email" required></input>
                                <p v-if = "validLoginEmail===false" class="errorsFields">Email null</p>
                                <p v-if = "validLoginEmailDomain===false" class="errorsFields">Email should contains @ with a domain </p>
                            </div>
                            
                            <div class="input__field">
                                    <b-icon icon="lock" class="input__icon"></b-icon>
                                <input type="password" class="input__text" v-model="form.password" placeholder="Password" required></input>
                                <p v-if = "validLoginPassword===false" class="errorsFields">Password null</p>
                            </div>
                        </div>
                        <b-button @click="loginValidation" class="login__button1">Join</b-button>
                        <br><br>
                        <p v-if="credentialsIncorrect" style="color:red;">*Incorrect Credentials</p>
                    </div>
                </div>
            </div>
        </div>`,
    methods: {
        loginValidation:function(){
            this.emailRegex.test(this.form.email)?this.validLoginEmailDomain = true:this.validLoginEmailDomain=false;
            this.form.email!=""?this.validLoginEmail=true:this.validLoginEmail=false;
            this.form.password != ""?this.validLoginPassword=true:this.validLoginPassword=false;
            if(this.validLoginEmailDomain==true&&this.validLoginEmail==true&&this.validLoginPassword==true){
                this.submitLogin();
            }
        },
        submitLogin: function(){
            this.processing=true;
            if(this.form.email != '' && this.form.password != '' ) {
                console.log("valido");
                let userLogin = new FormData();
                userLogin.append('email', this.form.email);
                userLogin.append('password', this.form.password);

                fetch('../trivial5/public/api/login2', {
                    method: 'POST',
                    headers: {"Accept": "application/json"},
                    body: userLogin
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if(data.message == "Credentials valid"){
                        userStore().logged = true;
                        userStore().loginInfo.idUser = data.user_id;
                        userStore().loginInfo.nombre = data.username;
                        console.log("valid");
                        router.push("/")
                    }
                    else {
                        this.credentialsIncorrect = true;
                    }
                }); 
                console.log("fetch funciona");
            }else {
                console.log("falta algun campo por rellenar");
            }
        },
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                    }
                }
            }
        }
    }
});

Vue.component('ranking', {
    template: ` <div class="nav-container">
                    <br><br>
                    <b-tabs pills card content-class="mt-3" align="center">
                        <b-tab title="Global" active active title-item-class="w-25 login__tab"><globalranking></globalranking></b-tab>
                        <b-tab title="Daily" title-item-class="w-25 register__tab"><dailyranking></dailyranking></b-tab>
                    </b-tabs>
                </div>`,
});

Vue.component('dailyranking', {
    data: function () {
        return {
            players: [],
        }
    },
    mounted() {

        fetch('../trivial5/public/dailyranking')
        .then(res => res.json())
        .then(data => {
            console.log("length " + data);
            for (let i = 0; i < data.length; i++) {
                console.log("Ranking " + data[i].name);
                this.players.push(data[i]);
                
            }
            console.log(JSON.stringify(this.players));
        });
    },
    template: ` <div class="ranking__list">
                    <br>
                    <div class="text-center">
                        <div class="ranking__content">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                    <tr v-for="(player, index) in this.players">
                                        <td>{{index + 1}}</td>
                                        <td><RouterLink :to="'/profile/'+player.id"> {{player.name}}</RouterLink></td>
                                        <td>{{player.score}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`,
});

Vue.component('globalranking', {
    data: function () {
        return {
            players: [],
        }
    },
    mounted() {

        fetch('../trivial5/public/rankingglobal')
        .then(res => res.json())
        .then(data => {
            console.log("length " + data.length);
            for (let i = 0; i < data.length; i++) {
                console.log("Ranking " + data[i].name);
                this.players.push(data[i]);
                
            }
            console.log(JSON.stringify(this.players));
        });
    },
    template: ` <div class="ranking__list">
                    <br>
                    <div class="text-center">
                        <div class="ranking__content">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                    <tr v-for="(player, index) in this.players">
                                        <td>{{index + 1}}</td>
                                        <td><RouterLink :to="'/profile/'+player.id"> {{player.name}}</RouterLink></td>
                                        <td>{{player.total_score}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`,
})

Vue.component('results' , {
    data: function () {
        return {
            correctAnswers: 0,
            points: 0,
            timer: 0,
            friends: [],
            withFriends: false,
            showButtons: true
        }
    },
    props: ['results', 'timerRestante', 'difficulty', 'daily', 'idGame'],
    template: ` <div class="game__result">
                    <br>
                    <div v-if="!isChallenge">
                        <h1 class="game__resultLetter">{{correctAnswers}}/{{results.length}} answers correct! </h1>
                        <h1 v-show="this.isLogged" class="game__resultLetter">Score: {{this.points}}</h1><br>
                    </div>
                    <div v-if="isChallenge">
                        <h1 class="game__resultLetter">Challenge</h1>
                        <b-row>
                            <b-col cols="6">
                                <h1 v-if="infoChallenge.score_challenger < this.points" class="game__resultLetter">Loser</h1>
                                <h1 v-if="infoChallenge.score_challenger > this.points" class="game__resultLetter">Winner</h1>
                                <h1 class="game__resultLetter">{{infoChallenge.nameChallenger}}</h1>
                                <h1 class="game__resultLetter">{{infoChallenge.score_challenger}}</h1>
                            </b-col>
                            <b-col cols="6">
                                <h1 v-if="infoChallenge.score_challenger > this.points" class="game__resultLetter">Loser</h1>
                                <h1 v-if="infoChallenge.score_challenger < this.points" class="game__resultLetter">Winner</h1>
                                <h1 class="game__resultLetter">{{userLogged.nombre}}</h1>
                                <h1 class="game__resultLetter">{{this.points}}</h1>
                            </b-col>
                        </b-row>
                    </div>
                    <b-button @click="$emit('lobby')">Lobby</b-button>
                    <b-button v-if="showButtons" @click="$emit('playagain')">Play again</b-button>
                    <b-button v-if="showButtons" v-b-modal="'sendChallenge'">Challenge someone!</B-button>

                    <div>
                        <b-modal id="sendChallenge" title="Challenge someone!" ok-only>
                            <p>Friend List</p>
                            <div v-if="withFriends === true" v-for="(friend, index) in friends">
                                <b-card class="mb-3 friend__list">
                                    <b-card-text class="friends__cardtext">
                                        {{friend.name}}
                                        <b-button variant="danger" class="button__delete" @click="sendChallenge(friend.id)">Send Challenge</b-button>
                                    </b-card-text>
                                </b-card>
                            </div>
                            <div v-if="withFriends === false">
                                <b-card class="mb-3 friend__list">
                                    <b-card-text class="friends__cardtext">
                                        No friends
                                    </b-card-text>
                                </b-card>
                            </div>
                            
                            </p>
                            <template #modal-footer>
                                <div class="w-100">
                                    <b-button
                                        variant="primary"
                                        size="sm"
                                        class="float-right"
                                        @click="$bvModal.hide('sendChallenge')"
                                    >
                                        Close
                                    </b-button>
                                </div>
                            </template>
                        </b-modal>
                    </div>
                </div>`,
    methods: {
        calcularPuntuacion: function() {
            this.points = (this.correctAnswers * 100) + this.timer;
            if(this.difficulty == 'medium') {
                this.points = this.points * 2;
            }
            else if (this.difficulty == 'hard'){
                this.points = this.points * 3;
            }
            else {
                console.log('level easy');
            }

            if(this.correctAnswer < 5) {
                this.points -= 300;
                if(this.points < 0) {
                    this.points = 0;
                }
            }
        },
        sendChallenge: function(id) {

            let dateNow = new Date();
            let day = dateNow.getDate();
            let month = dateNow.getMonth()+1;
            let year = dateNow.getFullYear();
            let date = day+"/"+month+"/"+year;

            let gameChallenge = new FormData();
            gameChallenge.append('idGame', this.idGame);
            gameChallenge.append('idChallenger', userStore().loginInfo.idUser);
            gameChallenge.append('idChallenged', id);
            gameChallenge.append('date', date);
            gameChallenge.append('scoreChallenger', this.points);

            fetch('../trivial5/public/storechallenge', {
                method: 'POST',
                body: gameChallenge
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let borrar = 0;
                for (let i = 0; i < this.friends.length; i++) {
                    console.log(this.friends[i].id + " id");
                    if(this.friends[i].id == id) {
                        borrar = i;
                    }
                }
                console.log("antes de " + borrar + " " + this.friends);
                this.friends.splice(borrar, 1); 
                console.log("despues de " + borrar + " " + this.friends);
            });
        }
    },
    mounted() {

        if(this.isChallenge || this.daily || !this.isLogged) {
            this.showButtons = false;
        }

        console.log("mounted dificultad " + this.difficulty)

        for (let i = 0; i < this.results.length; i++) {
            if(this.results[i]){
                this.correctAnswers++;
            }
        }

        if(userStore().logged) {
            
            this.timer = this.timerRestante;
            this.calcularPuntuacion();

            fetch('../trivial5/public/listfriends/' + userStore().loginInfo.idUser,{
                headers:{"Accept":"application/json"},
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data != "sin amigos") {
                    console.log("tiene amigos");
                    this.friends = data;
                    this.withFriends = true;
                }else{
                    this.withFriends = false;
                    console.log(this.withFriends);
                }
            }); 
        }

        if(userStore().challenged) {
            updateChallenge = new FormData();
            updateChallenge.append('idChallenged', this.infoChallenge.idChallenged);
            updateChallenge.append('idChallenger', this.infoChallenge.idChallenger);
            updateChallenge.append('idGame', this.infoChallenge.idGame);
    
            if(this.infoChallenge.score_challenger < this.points){
                updateChallenge.append('idWinner', this.infoChallenge.idChallenged);
            }
            else if(this.infoChallenge.score_challenger > this.points) {
                updateChallenge.append('idWinner', this.infoChallenge.idChallenger);
            }
            else {
                updateChallenge.append('idWinner', null);
            }
            updateChallenge.append('score_challenged', this.points);
    
            fetch('../trivial5/public/updatechallengewinner', {
                method: 'POST',
                body: updateChallenge
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
        }

        if(this.isLogged) {
            console.log("savedata hola");            
            this.$emit('saveData', this.points);
        }
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            if(userStore().logged){
                return userStore().loginInfo;
            }
        },
        
        isChallenge() {
            return userStore().challenged;
        },
        infoChallenge() {
            if(this.isChallenge){
                return userStore().challengeInfo;
            }
        }
    }
});

Vue.component('question' , {
    data: function () {
        return {
            userAnswer: false,
            arrayAnswersDesordenada: [],
            answered: null
        }
    },
    props: ['infoQuestion'],
    template: ` <div class="game__card">
                    <h3></h3>
                    <b-card
                    :title=infoQuestion.question
                    class="mb-2 game__card"
                    >
                        <br><br>
                        <div>
                            <b-row>
                                <b-col lg="6" class="pb-3" ml="10">
                                    <button v-if="isLogged" @click="getAnswerUser(0)" class="game__buttons_selection" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(0), game__answerIncorrect: comprobarRespuestaIncorrecta(0)  }">{{ this.arrayAnswersDesordenada[0].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(0)" class="game__buttons_selection">{{ this.arrayAnswersDesordenada[0].answer }}</button>
                                </b-col>
                                <b-col lg="6" class="pb-3" ml="10">
                                    <button v-if="isLogged" @click="getAnswerUser(1)" class="game__buttons_selection" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(1), game__answerIncorrect: comprobarRespuestaIncorrecta(1) }">{{ this.arrayAnswersDesordenada[1].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(1)" class="game__buttons_selection">{{ this.arrayAnswersDesordenada[1].answer }}</button>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col lg="6" class="pb-3" ml="10">
                                    <button v-if="isLogged" @click="getAnswerUser(2)" class="game__buttons_selection" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(2), game__answerIncorrect: comprobarRespuestaIncorrecta(2) }">{{ this.arrayAnswersDesordenada[2].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(2)" class="game__buttons_selection">{{ this.arrayAnswersDesordenada[2].answer }}</button>
                                </b-col>
                                <b-col lg="6" class="pb-3" ml="10">
                                    <button v-if="isLogged" @click="getAnswerUser(3)" class="game__buttons_selection" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(3), game__answerIncorrect: comprobarRespuestaIncorrecta(3) }">{{ this.arrayAnswersDesordenada[3].answer }}</button>
                                    <button v-if="!isLogged" @click="getAnswerUser(3)" class="game__buttons_selection">{{ this.arrayAnswersDesordenada[3].answer }}</button>
                                </b-col>
                            </b-row>
                        </div>
                        <br>
                        <slot></slot>
                    </b-card>
                   
                </div>`,
    methods: {
        getAnswerUser: function (numero) {
            if(!this.answered){
                console.log(this.arrayAnswersDesordenada[numero]);
                console.log(this.infoQuestion.correctAnswer);
                if(this.arrayAnswersDesordenada[numero].answer == this.infoQuestion.correctAnswer) {
                    this.userAnswer=true;
                    this.arrayAnswersDesordenada[numero].correcto = true;
                }
                else {
                    this.userAnswer = false;
                    this.arrayAnswersDesordenada[numero].incorrecto = true;
                    setTimeout(() => {
                        for (let i = 0; i < this.arrayAnswersDesordenada.length; i++) {
                            if(this.arrayAnswersDesordenada[i].answer == this.infoQuestion.correctAnswer){
                                this.arrayAnswersDesordenada[i].correcto = true;
                            } 
                        }
                      }, 500);
                }
                this.answered = true;
                this.$emit('userAnswer', this.userAnswer);
            }
        },
        comprobarRespuestaCorrecta: function(index) {
            if(this.arrayAnswersDesordenada[index].correcto) {
                return this.arrayAnswersDesordenada[index].correcto;
            }
            else {
                return false;
            }
        },
        comprobarRespuestaIncorrecta: function(index) {
            if(this.arrayAnswersDesordenada[index].incorrecto) {
                return this.arrayAnswersDesordenada[index].incorrecto;
            }
            else {
                return false;
            }
        }
    },
    beforeMount() {
        console.log("hola" + this.infoQuestion);
        this.infoQuestion.incorrectAnswers.forEach(element => {
            let a = {
                answer: element,
                correcto: null,
                incorrecto: null
            };
            this.arrayAnswersDesordenada.push(a);
        });
        let a = {
            answer: this.infoQuestion.correctAnswer,
            correcto: null,
            incorrecto: null
        };
        this.arrayAnswersDesordenada.push(a);
        shuffleArray(this.arrayAnswersDesordenada);
        // console.log(this.arrayAnswersDesordenada[0].answer);
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        }
    }
});

Vue.component('game' , {
    data: function () {
        return {
            showButtonPlay: true,
            showButtonDaily: false,
            questions: [],
            daily: false,
            idGame: null,
            selectedDifficulty: "easy",
            selectedCategory: "arts_and_literature",
            showQuestions: null,
            showResults: null,
            actualQuestion: 0,
            timer: 150,
            userAnswers: [null, null, null, null, null, null, null, null, null, null],
            boxTwo: '',
            page: 0,
        }
    },

    template: ` <div class="container_button_play" >
                    <div v-if="this.page == 0">
                        <div v-if="showButtonPlay" class="div_button_play">
                            <div class="start__tituloDiv">
                                <h4>WELCOME TO</h4>
                                <h1 class="start__tituloPrincipal"> LEAGUE OF <br> TRIVIAL</h1>
                            </div><br><br>
                            <div class="button__playDiv">
                                <b-button @click="playButton" class="button__play1">
                                    <span>P</span>
                                    <span>L</span>  
                                    <span>A</span>  
                                    <span>Y</span>
                                </b-button>
                            </div>
                            <br>     
                            <b-button v-if="isLogged && showButtonDaily" class="start__buttonDaily" @click="playDaily">DAILY</b-button>
                        </div>
                        <footercopyright v-if="showButtonPlay"></footercopyright>
                    </div>
                    <div class="select__optionsOuter">
                        <div class="select__options">
                            <div v-if="this.page == 1">
                                <br><br>
                                <p style="color: white; font-family: 'chubby', sans-serif; !important">Select difficulty</p>
                                <div class="difficulty__buttonsOuter">
                                    <div class="difficulty__buttons">
                                        <div><b-button @click="changeDifficulty('easy')" class="difficulty__easy">Easy</b-button></div>
                                        <div><b-button @click="changeDifficulty('medium')" class="difficulty__medium">Medium</b-button></div>
                                        <div><b-button @click="changeDifficulty('hard')" class="difficulty__hard">Hard</b-button></div>
                                    </div>
                                </div>

                                <p style="color: white; font-family: 'chubby', sans-serif !important;padding-top:20px;">Select category</p>
                                <div class="category__selectionsOuter">
                                    <div class="category__selections">
                                        <b-row style="padding-bottom:15px">
                                            <b-col cols="2"><b-button @click="changeCategory('arts_and_literature')">🎨</b-button></b-col>
                                            <b-col cols="2"><b-button @click="changeCategory('film_and_tv')">🎞️</b-button></b-col>
                                            <b-col cols="2"><b-button @click="changeCategory('food_and_drink')">🥘</b-button></b-col></b-col>
                                            <b-col cols="2"><b-button @click="changeCategory('general_knowledge')">🤓</b-button></b-col></b-col>
                                            <b-col cols="2"><b-button @click="changeCategory('geography')">🗺️</b-button></b-col></b-col>
                                        </b-row>
                                        <b-row>
                                            <b-col cols="2"><b-button @click="changeCategory('history')">📜</b-button></b-col></b-col>
                                            <b-col cols="2"><b-button @click="changeCategory('music')">🎼</b-button></b-col></b-col>
                                            <b-col cols="2"><b-button @click="changeCategory('science')">🔬</b-button></b-col></b-col>
                                            <b-col cols="2"><b-button @click="changeCategory('society_and_culture')">🧠</b-button></b-col></b-col>
                                            <b-col cols="2"><b-button @click="changeCategory('sport_and_leisure')">🤺</b-button></b-col></b-col>
                                        </b-row>
                                    </div>
                                </div>
                                <br><p style="color: white;">Your selection -> {{this.selectedDifficulty}} & {{this.selectedCategory}}</p>

                                <b-button @click="decreasePage"><span>Back</span></b-button>
                                <b-button @click="startGame"><span>Start</span></b-button><br><br>
                            </div>
                        </div>
                    </div>
                    <div class="game__outerDiv">
                        <div class="game__div">
                            <div v-if="showQuestions" v-for="(question, index) in this.questions" class="game__body">
                                <question v-show="actualQuestion == index" :infoQuestion="question" @userAnswer="addUserAnswer">
                                <br><br>
                                <div v-for="(answer, index) in userAnswers" class="game__cardFooter">
                                    <div v-if="isLogged" v-bind:class="{ game__answerCorrect:  comprobarRespuestaCorrecta(index), game__answerIncorrect: comprobarRespuestaIncorrecta(index)}">{{index+1}}</div>
                                </div>
                                <br><br>
                                <h3>Timer: {{timer}}</h3>
                                </question>
                            </div>
                        </div>
                    </div>
                    <div v-if="showQuestions"></div>
                        
                    <div v-if="showResults">
                        <results :results=userAnswers :timerRestante=timer :daily=daily :difficulty=selectedDifficulty :idGame=idGame @saveData="updateScore" @playagain="playagain" @lobby="resetAll"></results>
                    </div>
                </div>`,
    methods: {
        createGame: function(id) {
            this.showButtonPlay = false;
            this.showButtonDaily = false;
            let rutaFetch = "";
            if(!this.daily){
                if(this.isLogged && !userStore().challenged){
                    rutaFetch = "https://the-trivia-api.com/api/questions?categories="+ this.selectedCategory +"&limit=10&region=ES&difficulty=" + this.selectedDifficulty;
                }
                else {
                    console.log(id);
                    rutaFetch = "../trivial5/public/chargegame/"+id;
                }
            }
            else {
                rutaFetch = "../trivial5/public/daily";
            }
            console.log(rutaFetch);
            fetch(rutaFetch)
            .then(res => res.json())
            .then(data => {
                if(this.daily) {
                    console.log(data);
                    this.questions = JSON.parse(data.data);
                    this.idGame = data.id;
                    this.selectedDifficulty = data.difficulty;
                    this.selectedCategory = data.category;
                    this.saveData(-300);
                }
                else {
                    this.questions = data;
                    console.log('resturn de la partida encontrada ' + data);
                    if(userStore().challenged) {
                        // this.idGame = userStore().idChallenge;
                        this.idGame = userStore().challengeInfo.idGame;
                        this.page = 2;
                        this.selectedDifficulty = this.questions[0].difficulty;
                        this.saveData(-300);
                        
                    }
                }
                this.showQuestions = true;
                this.countDownTimer();
                if(this.isLogged && !this.daily && !userStore().challenged){
                    this.saveGame();
                }
            });
        },
        playagain: function() {
            this.resetAll();
            this.page=1;
            
        },
        startGame: function(){
            this.page++;
            this.createGame();
        },
        playButton: function() {
            if(this.isLogged){
                this.page++;
            }
            else {
                let randomID = Math.floor(Math.random() * 5);
                this.createGame(randomID);
            }
            
        },
        decreasePage: function() {
            this.page--;
        },
        changeDifficulty: function(difficulty) {
            console.log("dificultad param " + difficulty);
            this.selectedDifficulty = difficulty;
            console.log("dificultad this.selected " + this.selectedDifficulty);
        },
        changeCategory: function(category){
            this.selectedCategory = category;
        },
        incrementQuestion: function() {
            if(this.actualQuestion < 9) {
                this.actualQuestion++;
            }
            else {
                this.showQuestions = false;
                this.showResults = true;
            }
            console.log(this.actualQuestion);
        },
        addUserAnswer: function(userAnswer) {
            this.userAnswers[this.actualQuestion] = userAnswer;
            // this.userAnswers.push(userAnswer);
            console.log(this.userAnswers);
            if(this.isLogged){
                if(userAnswer) {
                    setTimeout(() => {
                        this.incrementQuestion();
                      }, "500");
                }
                else {
                    setTimeout(() => {
                        this.incrementQuestion();
                      }, "1500");
                }
            }
            else {
                setTimeout(() => {
                    this.incrementQuestion();
                }, "500");
            }
        },
        comprobarRespuestaCorrecta: function(index) {
            return this.userAnswers[index];
        },
        comprobarRespuestaIncorrecta: function(index) {
            if(this.userAnswers[index] == null) {
                return false;
            }else {
                return !this.userAnswers[index];
            }
        },
        updateScore: function(points) {
            console.log("update score " + points);

            let dataResults = new FormData();
            dataResults.append('idGame', this.idGame);
            dataResults.append('idUser', this.userLogged.idUser);
            dataResults.append('score', points);
            fetch('../trivial5/public/updatescore', {
                method: 'POST',
                body: dataResults
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
        },
        saveData: function(points) {
            console.log("guardarPuntuacion " + points);
            let dateNow = new Date();
            let day = dateNow.getDate();
            let month = dateNow.getMonth()+1;
            let year = dateNow.getFullYear();
            let date = day+"/"+month+"/"+year;
            let dataResults = new FormData();
            dataResults.append('idGame', this.idGame);
            // dataResults.append('idUser', userLogged.loginInfo.idUser);
            dataResults.append('idUser', this.userLogged.idUser);
            dataResults.append('score', points);
            dataResults.append('date', date);
            fetch('../trivial5/public/saveresult', {
                method: 'POST',
                body: dataResults
            })
            .then(res => res.json())
            .then(data => {
                console.log("return " + data);
                // userStore().challenged = false;
            });
        },
        saveGame: function() {
            let dateNow = new Date();
            let dataGame = new FormData();
            dataGame.append('data', JSON.stringify(this.questions));
            dataGame.append('category', this.selectedCategory);
            dataGame.append('difficulty', this.selectedDifficulty);
            dataGame.append('type', 'normal_game');
            dataGame.append('date', dateNow);
            fetch('../trivial5/public/savegame', {
                method: 'POST',
                body: dataGame
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.idGame = data;
                this.saveData(-300);
            });
        },
        playDaily: function() {
          
            this.daily = true;

            this.createGame();
        },
        resetAll: function() {
            this.showButtonPlay = true;
            this.showButtonDaily = false;
            this.questions = [];
            this.daily = false;
            this.idGame = null;
            this.selectedDifficulty = "easy";
            this.selectedCategory = "arts_and_literature";
            this.showQuestions = null;
            this.showResults = null;
            this.actualQuestion = 0;
            this.timer = 150;
            this.userAnswers = [null, null, null, null, null, null, null, null, null, null];
            this.boxTwo = '';
            this.page = 0;
            userStore().challenged = false;
        },
        countDownTimer () {
            if (this.timer > 0 && this.showQuestions == true) {
                setTimeout(() => {
                    this.timer--;
                    this.countDownTimer()
                }, 1000)
            }
            else {
                this.showQuestions = false;
                this.showResults = true;
            }
        },

        desplegarModalLogin() {
            this.boxTwo = ''
            this.$bvModal.msgBoxConfirm('This functionality is only available if you are logged in. Do you want to log in?', {
              title: 'Warning',
              size: 'sm',
              buttonSize: 'sm',
              okVariant: 'success',
              okTitle: 'Login',
              cancelVariant: 'danger',
              cancelTitle: 'Cancelar',
              footerClass: 'p-2',
              hideHeaderClose: false,
              centered: true
            })
              .then(value => {
                this.boxTwo = router.push('/join');
              })
              .catch(err => {
                // An error occurred
              })
            // router.push("/login");
        }
    },
    beforeMount () {

        this.resetAll();

        if(this.isLogged) {
            fetch("../trivial5/public/comprobardaily/"+ this.userLogged.idUser +"")
            .then(res => res.json())
            .then(data => {
                console.log("json" + data);
                if(data) {
                    this.showButtonDaily = false;
                }
                else {
                    this.showButtonDaily = true;
                }
                
             });
        }
    },
    mounted() {

        if(userStore().challenged){
            // this.createGame(userStore().idChallenge);
            this.createGame(userStore().challengeInfo.idGame);
        }
        
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            
            if(userStore().logged){
                return userStore().loginInfo;
            }
            else {
                return {
                    user: {
                        nombre: "",
                        imagen: ""
                    }
                }
            }
        }
    }
});

Vue.component('footercopyright',{
    template:`  <div class="footer" 
                    style="color: #eaeaeb;
                    line-height:50px;
                    bottom:0;
                    left:0;
                    width:100%;
                    ">
                    © Answers & questions come from <a href="https://the-trivia-api.com/">Trivia api</a>
                </div>`
});

Vue.component('statistics',{
    props:['questions'],
})

const Game = {
    template: ` <div>
                    <game>
                    </game>
                </div>`,
}
const Perfil = {
    template: `<profile></profile>`,
}

const Ranking = {
    template: `<ranking></ranking>`,
}
const Join = {
    template: `<join></join>`,
}

const Daily = {
    template:`<daily></daily>`
}

// 2. Define some routes
// Each route should map to a component.
const routes = [{
    path: '/',
    component: Game
}, {
    path: '/profile/:id',
    component: Perfil
},
{
    path: '/ranking',
    component: Ranking
},
{
    path: '/join',
    component: Join
},
{
    path: '/dailyGame',
    component: Daily
}, ]

// 3. Create the router instance and pass the `routes` option
const router = new VueRouter({
    routes // short for `routes: routes`
})

const userStore = Pinia.defineStore('usuario', {
    state() {
        return {
            logged: false,
            loginInfo: {
                nombre: '',
                idUser: ''
            },
            challenged: false,
            challengeInfo: {
                idChallenger: "",
                idChallenged: "",
                idGame: "",
                score_challenger: "",
                score_challenged: "",
                nameChallenger: "",
                nameChallenged: "",
            },
        }
    },
    actions: {
        setEstado(i) {
            this.loginInfo = i
        }
    }
})

Vue.use(Pinia.PiniaVuePlugin)
const pinia = Pinia.createPinia()

Vue.use(BootstrapVue)
let app = new Vue({
    el: '#app',
    router,
    pinia,
    data: {
    },
    computed: {
        ...Pinia.mapState(userStore, ['loginInfo', 'logged']),
        isLogged() {
            return userStore().logged;
        }
    },
    methods: {
        ...Pinia.mapActions(userStore, ['setEstado'])
    }
});
