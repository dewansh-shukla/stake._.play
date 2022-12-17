pragma solidity ^0.8.8;

contract ContestD {
    
    struct Contest{
        string startTime;
        uint256 endTime;
        string name;
        address creator;
        string desc;
    }

    struct ContestDonation{
        address payable user;
        uint256 amount;
        string playbackId;
    }

    mapping(string => string[]) public contestVideos;

    Contest[] public allContest;
    mapping(string => ContestDonation[]) public allContestsDonations;
    
    //temporary
    mapping(string => ContestDonation[]) public contestEndMap;

    function createContest(string calldata startTime, uint256 duration,string calldata name,string calldata desc) public{
        uint256 endTime = block.timestamp + duration*60;
        Contest memory cont = Contest(startTime,endTime,name,msg.sender,desc);
        allContest.push(cont);
    }

    function addVideosInContest(string calldata playbackId,string calldata contestName) public {
        contestVideos[contestName].push(playbackId);
    }

    function getVideosInContest(string calldata contestName) public view returns(string[] memory) {
        return contestVideos[contestName];
    } 
    
    function fetchAllContests() public view returns(Contest[] memory){
        return allContest;
    }

    function stakeInContest(string calldata key,string calldata contestName) payable public {
        ContestDonation memory contD =  ContestDonation(payable(msg.sender),msg.value,key);
        allContestsDonations[contestName].push(contD);
    }

    function fetchContestDonations(string calldata name) public view returns(ContestDonation[] memory){
        string memory contName;
        for(uint i=0;i<allContest.length;i++){
            if(keccak256(abi.encodePacked(name))==keccak256(abi.encodePacked(allContest[i].name))){
                contName = allContest[i].name;
            }
        }
        ContestDonation[] memory contDonations = allContestsDonations[contName];
        return contDonations;
    }

    function checkWinner(ContestDonation[] memory contestDonations) public returns(string memory){
        string memory winner;
        uint mx = 0;
        for(uint i=0;i<contestDonations.length;i++){
            contestEndMap[contestDonations[i].playbackId].push(contestDonations[i]);
            // if(contestEndMap[contestDonations[i].playbackId].length > mx){
            //     mx = contestEndMap[contestDonations[i].playbackId].length;
            //     winner = contestEndMap[contestDonations[i].playbackId][0].playbackId;
            // }
        }
        for(uint i=0;i<contestDonations.length;i++){
            if(contestEndMap[contestDonations[i].playbackId].length>mx){
                mx = contestEndMap[contestDonations[i].playbackId].length;
                winner = contestEndMap[contestDonations[i].playbackId][0].playbackId;
            }
        }

        return winner;
    }

    function releaseFunds(string calldata contestName) public payable{
        Contest memory cont;
        for(uint i=0;i<allContest.length;i++){
            if(keccak256(abi.encodePacked(contestName))==keccak256(abi.encodePacked(allContest[i].name))){
                cont= allContest[i];
            }
        }
        // require(block.timestamp >= cont.endTime,"Contest is Live");
        ContestDonation[] memory currentContDonation = allContestsDonations[cont.name];
        string memory winner = checkWinner(currentContDonation);
        uint winnersCount=0;
        uint256 totalAmount=0;
        for(uint i=0;i<currentContDonation.length;i++){
            if(keccak256(abi.encodePacked(winner)) == keccak256(abi.encodePacked(currentContDonation[i].playbackId))){
                address payable user  = currentContDonation[i].user;
                uint256 amount = currentContDonation[i].amount;
                user.transfer(amount); 
                winnersCount++;
            }else{
                totalAmount += currentContDonation[i].amount;
            }
        }
        uint256 winnersAmount = totalAmount/winnersCount;
        for(uint i=0;i<currentContDonation.length;i++){
            if(keccak256(abi.encodePacked(winner)) == keccak256(abi.encodePacked(currentContDonation[i].playbackId))){
                address payable user= currentContDonation[i].user;
                user.transfer(winnersAmount);
            }
        }
    }
}