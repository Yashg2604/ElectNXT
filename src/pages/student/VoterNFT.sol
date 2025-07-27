// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoterNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(address => bool) public hasMinted;

    constructor(address initialOwner) ERC721("ElectNXT Voter NFT", "VNFT") Ownable(initialOwner) {
        tokenCounter = 1; // start from 1 for clarity
    }

    function mintNFT(address to, string memory tokenURI) external onlyOwner {
        require(!hasMinted[to], "NFT already minted for this address");

        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        hasMinted[to] = true;
        tokenCounter++;
    }

    function hasNFT(address user) external view returns (bool) {
        return hasMinted[user];
    }
}


