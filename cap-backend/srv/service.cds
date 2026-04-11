using sap.btp.app20 from '../db/schema';

service EvaluationService {
    entity VendorEvaluations as projection on app20.VendorEvaluations;
}
