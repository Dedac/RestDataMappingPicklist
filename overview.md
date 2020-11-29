Get REST data and pick from a single picklist with the option to map additional data back to your work item.
Use this with the ServiceNow table api, or any other Rest API.

If a rest service returns and array of objects, select the key field that should be in the drop down, and when and item is selected, other fields in the work item can be updated by the rest data.


Sample Rest Response from which you want to extract a picklist.
```
{
    "page": 2,
    "per_page": 6,
    "total": 12,
    "data": [
        {
            "id": 7,
            "email": "michael.lawson@reqres.in",
            "first_name": "Michael",
            "last_name": "Lawson",
        },
        {
            "id": 8,
            "email": "lindsay.ferguson@reqres.in",
            "first_name": "Lindsay",
            "last_name": "Ferguson",
        }
    ]
}
```

Sample Settigns for Calling this Service

| Setting | Value |
|---|---|
| Rest Service Key Field | `email` |
| JSON Path to the Array | `data` |
| Rest Call URL parameters | `{ "page":"2" }` |
| FieldMap | `{ "Custom.SelectedUserId" : "id", "Custom.SelectedUser" : "last_name" } ` |

'Custom.' are custom field names in Azure DevOps, use the fields names that you want data from the rest service mapped to.

Add https://dedac.gallerycdn.vsassets.io to the CORS allowed domains to use the extension

