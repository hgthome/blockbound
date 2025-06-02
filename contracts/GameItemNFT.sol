// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameItemNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    struct ItemStats {
        uint8 attack;
        uint8 defense;
        uint8 speed;
        uint8 health;
        uint8 magic;
        uint8 critChance;
    }

    struct GameItem {
        string name;
        string description;
        ItemStats stats;
        uint8 rarity; // 0=common, 1=uncommon, 2=rare, 3=epic, 4=legendary
        uint8 itemType; // 0=weapon, 1=armor, 2=accessory, 3=consumable
        uint8 level;
        string pixelArtData; // JSON string of pixel art data
    }

    mapping(uint256 => GameItem) public gameItems;
    mapping(address => uint256[]) public playerItems;

    event ItemMinted(address indexed player, uint256 indexed tokenId, string name, uint8 rarity);

    constructor() ERC721("BlockBound Game Items", "BBGI") Ownable(msg.sender) {}

    function mintItem(
        address to,
        string memory name,
        string memory description,
        ItemStats memory stats,
        uint8 rarity,
        uint8 itemType,
        uint8 level,
        string memory pixelArtData,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        gameItems[tokenId] = GameItem({
            name: name,
            description: description,
            stats: stats,
            rarity: rarity,
            itemType: itemType,
            level: level,
            pixelArtData: pixelArtData
        });

        playerItems[to].push(tokenId);

        emit ItemMinted(to, tokenId, name, rarity);
        return tokenId;
    }

    function getPlayerItems(address player) public view returns (uint256[] memory) {
        return playerItems[player];
    }

    function getItemDetails(uint256 tokenId) public view returns (GameItem memory) {
        require(ownerOf(tokenId) != address(0), "Item does not exist");
        return gameItems[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 