import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  Upgraded as UpgradedEvent,
  RECCertified as RECCertifiedEvent,
  RECRejected as RECRejectedEvent,
  RECRequested as RECRequestedEvent,
} from "../generated/ArkreenRECIssuance/ArkreenRECIssuance"
import { AdminChanged, BeaconUpgraded, Upgraded ,REC} from "../generated/schema"

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


export function handleRECCertified(event: RECCertifiedEvent): void {
  // let entity = new RECCertified(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.issuer = event.params.issuer
  // entity.tokenId = event.params.tokenId

  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash

  // entity.save()

  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }
  //rec.tokenId = event.params.tokenId
  rec.issuer = event.params.issuer.toHexString()
  rec.status = "Certified"
  rec.save()

}

export function handleRECRejected(event: RECRejectedEvent): void {
  // let entity = new RECRejected(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.tokenId = event.params.tokenId

  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash

  // entity.save()

  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }
  rec.status = "Rejected"
  rec.issuer = event.transaction.from.toHexString()
  rec.save()
}

export function handleRECRequested(event: RECRequestedEvent): void {
  // let entity = new RECRequested(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.owner = event.params.owner
  // entity.tokenId = event.params.tokenId

  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash

  // entity.save()


  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    rec = new REC(id)
    rec.tokenId = event.params.tokenId
    rec.status = "Pending"
    rec.blockNum = event.block.number
    
  }

  rec.owner = event.params.owner.toHexString()
  rec.save()
  
}