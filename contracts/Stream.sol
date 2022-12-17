pragma solidity ^0.8.8;

contract Stream {
    uint index = 0;

    address public owner;

    struct Video {
        string videoKey;
        string type_;
    }

    struct Donation {
        address payable client;
        uint256 amount;
        string message;
    }

    struct VideoD {
        string key;
        address payable creator;
    }

    VideoD[] public regularVideoD;
    VideoD[] public streamVideoD;
    mapping(address => Video[]) public VMap;
    mapping(string => Donation[]) public VideoDonations;
    string[] public videoKeys;

    constructor() {
        owner = msg.sender;
    }

    function addVideo(string calldata key, string calldata type_) public {
        Video memory vid = Video(key, type_);
        VMap[msg.sender].push(vid);
        videoKeys.push(key);
        VideoD memory vd = VideoD(key, payable(msg.sender));
        if (keccak256(abi.encodePacked(type_)) == keccak256(abi.encodePacked("regular"))) {
            regularVideoD.push(vd);
        } else {
            streamVideoD.push(vd);
        }
    }

    function addDonations(string calldata key,string calldata message) public payable {
        Donation memory d = Donation(payable(msg.sender), msg.value,message);
        VideoDonations[key].push(d);
        address creator = getVideoCreator(key);
        payable(creator).transfer(msg.value);
    }

    function getVideoCreator(
        string calldata key
    ) public view returns (address) {
        for (uint i = 0; i < regularVideoD.length; i++) {
            if (
                keccak256(abi.encodePacked(regularVideoD[i].key)) ==
                keccak256(abi.encodePacked(key))
            ) {
                return regularVideoD[i].creator;
            }
        }

        for (uint i = 0; i < streamVideoD.length; i++) {
            if (
                keccak256(abi.encodePacked(streamVideoD[i].key)) ==
                keccak256(abi.encodePacked(key))
            ) {
                return streamVideoD[i].creator;
            }
        }
    }

    function checkKey(string calldata key) public view returns (bool) {
        for (uint i = 0; i < videoKeys.length; i++) {
            if (
                keccak256(abi.encodePacked(videoKeys[i])) ==
                keccak256(abi.encodePacked(key))
            ) {
                return true;
            }
        }
        return false;
    }

    //Refund Amount
    function releaseFunds(string calldata key) public {
        require(checkKey(key), "This Video is not registerd");
        Donation[] memory donations = VideoDonations[key];
        for (uint i = 0; i < donations.length; i++) {
            address payable a = donations[i].client;
            uint amount = donations[i].amount;
            a.transfer(amount);
        }
        delete VideoDonations[key];
    }

    function getDonations(
        string calldata key
    ) public view returns (Donation[] memory) {
        return VideoDonations[key];
    }

    function getRegularVideos() public view returns (VideoD[] memory) {
        return regularVideoD;
    }

    function getStreamVideos() public view returns (VideoD[] memory) {
        return streamVideoD;
    }

    function getAllVideosOfCreator(
        address userAddress
    ) public view returns (Video[] memory) {
        return VMap[userAddress];
    }
}
