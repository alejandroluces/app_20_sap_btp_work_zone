namespace sap.btp.app20;

entity VendorEvaluations {
  key ID : UUID;
  vendorId : String(50);
  evaluator : String(100);
  evaluationDate : DateTime;
  question1Score : Integer;
  question2Score : Integer;
  question3Score : Integer;
  question4Score : Integer;
  question5Score : Integer;
  averageScore : Decimal(3,2);
  comments : String(500);
  createdAt : Timestamp @cds.on.insert : $now;
}
