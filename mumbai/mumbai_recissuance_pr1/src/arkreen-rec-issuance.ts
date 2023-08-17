import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  Upgraded as UpgradedEvent,
  RECCertified as RECCertifiedEvent,
  RECRejected as RECRejectedEvent,
  RECRequested as RECRequestedEvent,

  RECCanceled as RECCanceledEvent,
  RECLiquidized as RECLiquidizedEvent,
  ESGBatchMinted as ESGBatchMintedEvent,
  RedeemFinished as RedeemFinishedEvent,
  Transfer as TransferEvent, 
  RECDataUpdated as RECDataUpdatedEvent,
  ESGBatchDataUpdated as ESGBatchDataUpdatedEvent,


  ArkreenRECIssuance

} from "../generated/ArkreenRECIssuance/ArkreenRECIssuance"
import { AdminChanged, BeaconUpgraded, Upgraded ,REC, } from "../generated/schema"
import { log } from '@graphprotocol/graph-ts'

function getStatusString(status: u32): string{

  // enum RECStatus {
  //   Pending
  //   Rejected
  //   Cancelled
  //   Certified
  //   Retired
  //   Liquidized
  // }

    switch (status) {
      case 0: return "Pending";
      case 1: return "Rejected";
      case 2: return "Cancelled";
      case 3: return "Certified";
      case 4: return "Retired";
      case 5: return "Liquidized";
      default: return ""
    }
}

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

export function handleESGBatchMinted(event: ESGBatchMintedEvent): void{

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)

  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    rec = new REC(id)
    rec.tokenId = event.params.tokenId
    // rec.status = "Pending"
    rec.blockNum = event.block.number
    rec.owner = event.params.owner
    rec.issuer = RECData.issuer
    rec.status = getStatusString(RECData.status)
  }

  log.info("Mint ESGBatch for {} with status {} in number {}", [rec.owner.toHexString(), rec.status, rec.tokenId.toHexString()])

  rec.save()
}

export function handleRECRequested(event: RECRequestedEvent): void {

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)

  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    rec = new REC(id)
    rec.tokenId = event.params.tokenId
    // rec.status = "Pending"
    rec.blockNum = event.block.number
    rec.owner = event.params.owner
    rec.issuer = RECData.issuer
    rec.status = getStatusString(RECData.status)
  }
  log.info("*** Mint NFT for {} with status {} in number {}", [rec.owner.toHexString(), rec.status, rec.tokenId.toHexString()])
  rec.save()

}


export function handleRECCertified(event: RECCertifiedEvent): void {

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)

  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }
  //rec.tokenId = event.params.tokenId
  // rec.issuer = event.params.issuer.toHexString()
  rec.issuer = event.params.issuer
  // rec.status = "Certified"
  rec.status = getStatusString(RECData.status)
  rec.serialNumber = RECData.serialNumber

  log.info("*** Certified NFT for {} with status {} in number {}", [rec.owner.toHexString(), rec.status, rec.tokenId.toHexString()])

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

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)

  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }
  // rec.status = "Rejected"
  rec.status = getStatusString(RECData.status)

  log.info("*** Rejected NFT for {} with status {} in number {}", [rec.owner.toHexString(), rec.status, rec.tokenId.toHexString()])


  rec.save()
}



export function handleRECCanceled(event: RECCanceledEvent): void {

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)

  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }
  // rec.status = "Cancelled"
  rec.status = getStatusString(RECData.status)

  log.info("*** Canceled NFT for {} with status {} in number {}", [rec.owner.toHexString(), rec.status, rec.tokenId.toHexString()])

  rec.save()
}

export function handleRECLiquidized(event: RECLiquidizedEvent): void{
  // emit RECLiquidized(owner, tokenId, amountREC);

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)


  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }

  // rec.status = "Liquidized"
  rec.status = getStatusString(RECData.status)

  log.info("*** Liquidized NFT for {} with status {} in number {}", [rec.owner.toHexString(), rec.status, rec.tokenId.toHexString()])

  rec.save()

}

export function handleRedeemFinished(event: RedeemFinishedEvent): void{

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)


  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }

  // rec.status = "Retired"
  rec.status = getStatusString(RECData.status)
  log.info("*** Redeemed NFT for {} with status {} in number {}", [rec.owner.toHexString(), rec.status, rec.tokenId.toHexString()])

  rec.save()
}

export function handleTransfer(event: TransferEvent): void{
  // event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)


  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }

  rec.owner = event.params.to
  rec.status = getStatusString(RECData.status)

  log.info("*** transfer NFT {} from {} to {}  with status {}", [rec.id, event.params.from.toHexString(),event.params.to.toHexString(), rec.status])

  rec.save()
}

export function handleRECDataUpdated(event: RECDataUpdatedEvent):void{

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)


  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }

  // rec.status = "Pending"
  rec.status = getStatusString(RECData.status)
  rec.issuer = RECData.issuer
  log.info("*** RECDataUpdated NFT info cause status change to  {} in number {}", [rec.status, rec.tokenId.toHexString()])

  rec.save()
}

export function handleESGBatchDataUpdated(event: ESGBatchDataUpdatedEvent):void{

  const contract = ArkreenRECIssuance.bind(event.address)
  const RECData = contract.getRECData(event.params.tokenId)


  let id = event.params.tokenId.toString()
  let rec = REC.load(id)
  if (rec == null) {
    return
  }

  // rec.status = "Pending"
  rec.status = getStatusString(RECData.status)

  log.info("*** ESGBatchDataUpdated NFT info cause status change to  {} in number {}", [rec.status, rec.tokenId.toHexString()])

  rec.save()

}
