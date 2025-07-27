// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ElectNXT is Ownable {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public totalCandidates;

    mapping(address => bool) public hasVoted;
    bool public electionStarted;
    bool public electionEnded;

    event VoteCasted(address indexed voter, uint256 candidateId);
    event ElectionStarted();
    event ElectionEnded();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function addCandidate(string memory name) external onlyOwner {
        require(!electionStarted, "Election already started");
        candidates[totalCandidates] = Candidate(name, 0);
        totalCandidates++;
    }

    function startElection() external onlyOwner {
        require(!electionStarted, "Election already started");
        electionStarted = true;
        emit ElectionStarted();
    }

    function endElection() external onlyOwner {
        require(electionStarted, "Election hasn't started yet");
        require(!electionEnded, "Election already ended");
        electionEnded = true;
        emit ElectionEnded();
    }

    function vote(uint256 candidateId) external {
        require(electionStarted, "Election has not started");
        require(!electionEnded, "Election has ended");
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateId < totalCandidates, "Invalid candidate");

        candidates[candidateId].voteCount += 1;
        hasVoted[msg.sender] = true;
        emit VoteCasted(msg.sender, candidateId);
    }

    function getCandidate(uint256 candidateId) external view returns (string memory, uint256) {
        require(candidateId < totalCandidates, "Invalid candidate");
        Candidate memory c = candidates[candidateId];
        return (c.name, c.voteCount);
    }

    function getWinner() external view returns (string memory winnerName, uint256 highestVotes) {
        require(electionEnded, "Election is still ongoing");

        uint256 maxVotes = 0;
        uint256 winnerId = 0;

        for (uint256 i = 0; i < totalCandidates; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }

        Candidate memory winner = candidates[winnerId];
        return (winner.name, winner.voteCount);
    }
}


