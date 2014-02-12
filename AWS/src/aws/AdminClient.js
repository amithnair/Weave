goog.provide('aws.AdminClient');

goog.require('aws');

var adminServiceURL = '/WeaveServices/AdminService';

/**
 * This function mirrors the getEntityHierarchyInfo on the servlet.
 * @param {String} user username
 * @param {String} password
 * @param {number} entityId
 * @param {aws.DataEntityMetadata} diff
 * @param {function()} handleResult
 */
aws.AdminClient.updateEntity = function(user, password, entityId, diff, handleResult) {
	aws.queryService(adminServiceURL, "updateEntity", [user, password, entityId, diff], handleResult);
};