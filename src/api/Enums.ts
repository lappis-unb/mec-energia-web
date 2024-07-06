enum ErrorCode {
  TariffsNotFoundError = 1,
  NotEnoughEnergyBills = 2,
  NotEnoughEnergyBillsWithAtypical = 3,
  PendingBillsWarnning = 4,
  ExpiredTariffWarnning = 5,
}

export {
  ErrorCode,
}