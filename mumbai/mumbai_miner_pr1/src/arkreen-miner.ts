import { Bytes } from "@graphprotocol/graph-ts/common/collections"
import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  Upgraded as UpgradedEvent,
  MinerOnboarded as MinerOnboardedEvent,
  StandardMinerOnboarded as StandardMinerOnboardedEvent,
  Transfer as TransferEvent,
  ArkreenMiner 

} from "../generated/ArkreenMiner/ArkreenMiner"

import { AdminChanged, BeaconUpgraded, Upgraded , 
  MinerOnboarded, StandardMinerOnboarded,Transfer, MinerTransactionRecord} from "../generated/schema"
import { BigInt} from "@graphprotocol/graph-ts"

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousAdmin = event.params.previousAdmin
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBeaconUpgraded(event: BeaconUpgradedEvent): void {
  let entity = new BeaconUpgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beacon = event.params.beacon

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMinerOnboarded(event: MinerOnboardedEvent): void {
  let entity = new MinerOnboarded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.miner = event.params.miner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}


export function handleStandardMinerOnboarded(event: StandardMinerOnboardedEvent): void {
  let entity = new StandardMinerOnboarded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.miner = event.params.miner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}


export function handleTransfer(event: TransferEvent): void {

  let id = event.params.tokenId.toString()

  let mtr = MinerTransactionRecord.load(id)
  if (mtr == null) {
    mtr = new MinerTransactionRecord(id)

    //get minerInfo from contract
    let contract = ArkreenMiner.bind(event.address)
    let miner_info = contract.AllMinerInfo(event.params.tokenId)

    mtr.miner = miner_info.getMAddress()
    mtr.lastTransactionHash = new Bytes(0)
    mtr.transferCount = 0
    mtr.historyOwners = []
  }

  //preserve old lastTransaction
  let lastTransactionHash = mtr.lastTransactionHash
  mtr.lastTransactionHash = event.transaction.hash
  mtr.transferCount = mtr.transferCount + 1

  let owners =  mtr.historyOwners
  owners.push(event.params.to)
  mtr.historyOwners = owners

  mtr.save()


  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.lastTransactionHash = lastTransactionHash
  entity.miner = mtr.miner

  entity.save()

}