import { ethers } from "ethers";
import deploy from "./deploy";
import addContract from "./addContract";
import "./index.scss";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow";

let contracts = 0;
async function newContract() {
  const beneficiary = document.getElementById("beneficiary").value;
  const arbiter = document.getElementById("arbiter").value;
  let value = ethers.utils.parseEther(document.getElementById("wei").value);
  const contract = await deploy(arbiter, beneficiary, value);
  addContract(++contracts, contract, arbiter, beneficiary, value);
}

async function addExistingContract() {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const address = document.getElementById("existing-address").value;
  const contract = await new ethers.Contract(address, Escrow.abi, signer);
  const beneficiary = await contract.beneficiary();
  const arbiter = await contract.arbiter();
  const value = await provider.getBalance(address);
  addContract(++contracts, contract, arbiter, beneficiary, value);
  const approved = await contract.isApproved();
  if (approved) {
    document.getElementById(`approve-${contracts}`).className = "complete";
    document.getElementById(`approve-${contracts}`).innerText =
      "✓ It's been approved!";
  }
}

document.getElementById("deploy").addEventListener("click", newContract);
document
  .getElementById("add-existing")
  .addEventListener("click", addExistingContract);
