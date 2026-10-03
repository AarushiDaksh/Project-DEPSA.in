trigger OrderTrigger on Order__c (
    before insert,
    after insert
) {
    if (Trigger.isAfter && Trigger.isInsert) {
        NotificationService.sendNotification(
            Trigger.new[0].Account__c
        );
    }
}