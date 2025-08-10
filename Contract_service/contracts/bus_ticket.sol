// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract BusTicket is ERC721URIStorage, Ownable {
     

     struct ticket {
         uint256 ticketId;
         string tripId;
         string passengerName;
         string passengerPhone;
         string seatNumber;
         uint256 bookingTime;
         uint256 issueDate;
         string status; // "active", "booked", "cancelled", "checked-in", "used"
         uint256 expiredDate;
         string pdfUrl;
         string pdfCid;
         string metadataCid;
         string nftStorageUrl;
         string metadataUrl;
         string contractAddress;
         string blockchainTxHash;
     }
     mapping(uint256 => ticket) public tickets;
     uint256 public ticketCounter;
     event TicketIssued(uint256 indexed ticketId, string passengerName, string passengerPhone, string seatNumber, uint256 issueDate);
     event TicketCancelled(uint256 indexed ticketId, string status);
     event TicketUpdated(uint256 indexed ticketId, string status);
     event TicketTransferred(uint256 indexed ticketId, address from, address to);


     constructor() ERC721("BusTicket", "BTK") Ownable(msg.sender) {

        
    
     }

     function MintTicketToUserWallet (
         address to,
         string memory tripId,
         string memory passengerName,
         string memory passengerPhone,
         string memory seatNumber,
         string memory pdfCid,
         string memory metadataCid,
         string memory pdfUrl,
         string memory metadataUrl,
         uint256 expiredDate
     ) public onlyOwner returns (uint256) {
         ticketCounter++;
         uint256 newTicketId = ticketCounter;

         tickets[newTicketId] = ticket({
             ticketId: newTicketId,
             tripId: tripId,
             passengerName: passengerName,
             passengerPhone: passengerPhone,
             seatNumber: seatNumber,
             bookingTime: block.timestamp,
             issueDate: block.timestamp,
             status: "booked",
             expiredDate: expiredDate,
             pdfUrl: pdfUrl,
             pdfCid: pdfCid,
             metadataCid: metadataCid,
             nftStorageUrl: "",
             metadataUrl: metadataUrl,
             contractAddress: "",
             blockchainTxHash: ""
         });

         _mint(to, newTicketId);
         _setTokenURI(newTicketId, metadataUrl);
         emit TicketIssued(newTicketId, passengerName, passengerPhone, seatNumber, block.timestamp);
         
         return newTicketId;
     }

    function CancelTicket(uint256 ticketId) public onlyOwner {
         require(tickets[ticketId].ticketId != 0, "Ticket does not exist");
         require(
             keccak256(abi.encodePacked(tickets[ticketId].status)) == keccak256(abi.encodePacked("booked")) ||
             keccak256(abi.encodePacked(tickets[ticketId].status)) == keccak256(abi.encodePacked("active")), 
             "Ticket is not valid for cancellation"
         );

         tickets[ticketId].status = "cancelled";
         emit TicketCancelled(ticketId, tickets[ticketId].status);
     }

    function UpdateTicketStatus(uint256 ticketId, string memory newStatus) public onlyOwner {
         require(tickets[ticketId].ticketId != 0, "Ticket does not exist");
         require(
             keccak256(abi.encodePacked(tickets[ticketId].status)) != keccak256(abi.encodePacked("cancelled")) &&
             keccak256(abi.encodePacked(tickets[ticketId].status)) != keccak256(abi.encodePacked("used")), 
             "Ticket is not valid for status update"
         );

         tickets[ticketId].status = newStatus;
         emit TicketUpdated(ticketId, newStatus);
     }
     

    function GetTicketsByPhone (string memory passengerPhone) public view returns (ticket[] memory) {
         uint256 count = 0;
         for (uint256 i = 1; i <= ticketCounter; i++) {
             if (keccak256(abi.encodePacked(tickets[i].passengerPhone)) == keccak256(abi.encodePacked(passengerPhone))) {
                 count++;
             }
         }

         ticket[] memory result = new ticket[](count);
         uint256 index = 0;
         for (uint256 i = 1; i <= ticketCounter; i++) {
             if (keccak256(abi.encodePacked(tickets[i].passengerPhone)) == keccak256(abi.encodePacked(passengerPhone))) {
                 result[index] = tickets[i];
                 index++;
             }
         }
         return result;
     }  
     


     // function CheckAllTicketValidation(
     //     uint256 ticketId
     // ) public view returns (bool) {
     //     ticket memory t = tickets[ticketId];
     //     require(t.ticketId != 0, "Ticket does not exist");
     //     require(keccak256(abi.encodePacked(t.status)) == keccak256(abi.encodePacked("issued")), "Ticket is not valid");
     //     return true;
     // }    
     

}