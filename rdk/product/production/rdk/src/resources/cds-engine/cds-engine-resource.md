# Group Cds

## Cds engine cds engine [{{{path}}}]

### Get [GET {{{path}}}/registry{?id}{&name}{&filter}]

Engine Registry resource

#### Notes

Get engine registry

+ Parameters

    + id (string, optional) - id of engine registry

    + name (string, optional) - name of engine registry

    + filter (string, optional) - match filter


+ Response 200 (application/json)

:[Response 400]({{{common}}}/responses/400.md)

:[Response 404]({{{common}}}/responses/404.md)

:[Response 500]({{{common}}}/responses/500.md)


### Post [POST {{{path}}}/registry{?name}]

Engine Registry resource

#### Notes

Create an engine registry

+ Parameters

    + name (string, optional) - name of engine registry


+ Request JSON Message (application/json)

+ Response 200 (application/json)

:[Response 400]({{{common}}}/responses/400.md)

:[Response 404]({{{common}}}/responses/404.md)

:[Response 500]({{{common}}}/responses/500.md)


### Put [PUT {{{path}}}/registry{?name}]

Engine Registry resource

#### Notes

Update an engine registry(s)

+ Parameters

    + name (string, optional) - name of engine registry


+ Request JSON Message (application/json)

+ Response 200 (application/json)

:[Response 400]({{{common}}}/responses/400.md)

:[Response 404]({{{common}}}/responses/404.md)

:[Response 500]({{{common}}}/responses/500.md)


### Delete [DELETE {{{path}}}/registry{?id}{&name}]

Engine Registry resource

#### Notes

Delete an excution request

+ Parameters

    + id (string, optional) - id of engine registry

    + name (string, optional) - name of engine registry


+ Response 200 (application/json)

:[Response 400]({{{common}}}/responses/400.md)

:[Response 404]({{{common}}}/responses/404.md)

:[Response 500]({{{common}}}/responses/500.md)

