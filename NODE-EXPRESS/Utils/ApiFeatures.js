class ApiFeatures {
    constructor(query, requestQuery, count) {
        this.query = query;
        this.requestQuery = requestQuery;
        this.count = count;
    }
    filter() {
        const queryObj = { ...this.requestQuery };
        const exludeQuery = ['page', 'sort', 'limit', 'fields'];

        exludeQuery.forEach((element) => {
            delete queryObj[element]
        });


        let stringParams = JSON.stringify(queryObj);

        // replace gte, gt, lt,lte with  $gte, $gt.....
        stringParams = stringParams.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`); // use \b to set exact match, replace all occurance by adding g
        // return back to json
        const queryParams = JSON.parse(stringParams)
        this.query = this.query.find(queryParams);
        return this;

    }
    sort() {
        //check if sort is passed on query string otherwise let us sort by createdAt (optionally)
        if (this.requestQuery.sort) {

            //  query = query.sort(request.query.sort) //use - negetive for descending order ie sort(-name)
            // if we have multiple sort key, separate them by space i.e sort('name gender');
            // how to hanlde multiple sort key
            const sortKey = this.requestQuery.sort.split(',').join(' '); // convert to array then convert to string by seprating them with space
            this.query = this.query.sort(sortKey); //use - negetive for descending order ie sort(-name)
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitField() {
        if (this.requestQuery.fields) {

            const selectFiels = this.requestQuery.fields.split(',').join(' ');
            // query = query.
            this.query = this.query.select(selectFiels);
        } else {
            this.query = this.query.select('-__v'); //exclude column by adding minus - before
        }
        return this;
    }

    paginate() {
        const page = this.requestQuery.page || 1;
        const limit = this.requestQuery.limit || 0;
        // calculate records to skip
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        // ensure that the document to skip does not exceed the number of document in the database
        // const count = await Movie.countDocuments();
        if (skip >= this.count) {
            throw new Error('Page not Found');
        }
        return this;
    }
}
module.exports = ApiFeatures;