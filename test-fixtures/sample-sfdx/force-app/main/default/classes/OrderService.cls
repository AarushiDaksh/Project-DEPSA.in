public with sharing class OrderService {

    public static Order__c createOrder(Id accountId) {

        Account account = [
            SELECT Id, Name
            FROM Account
            WHERE Id = :accountId
            LIMIT 1
        ];

        Order__c order = new Order__c(
            Account__c = account.Id
        );

        insert order;

        NotificationService.sendNotification(
            account.Id
        );

        return order;
    }
}