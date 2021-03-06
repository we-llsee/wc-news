const models=require('../models/models.js')

exports.getTopics =(req,res,next) => {

    const {limit}= req.query;
    const {p} = req.query;

    return models.fetchTopics(limit,p).then((topics)=>{
        return res.status(200).send({topics});
    }).catch(err=>{
        next(err)
    })
}

exports.getArticleById=(req,res,next) => {
    const {article_id} =req.params;

    return models.fetchArticleById(article_id)
    .then((article)=>{    
        article[0].comment_count = +article[0].comment_count
        return res.status(200).send({article:article[0]});
    }).catch((err)=>{
        next(err);
    })

};

exports.patchArticleById=(req,res,next) =>{
    const {article_id} =req.params;
    const {inc_votes} = req.body;
    
    return Promise.resolve().then(()=>{
        if(Number.isNaN(+article_id)){
            return Promise.reject({status:400, msg:'Invalid article_id'})
        }  
        
        if(Number.isInteger(+inc_votes)===false){
            return Promise.reject({status:400, msg:'Invalid PATCH body'})
        }
    }).then(()=>{
        return models.updateArticleById(inc_votes,article_id)
    }).then(({rows:[article]})=>{
        return res.status(200).send({article});
    }).catch((err) => next(err))
   
}

exports.getUsers=(req,res,next) => {
    models.fetchUsers().then((users)=> {
        return res.status(200).send({users})
    });
}

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id}=req.params;
    const {limit}=req.query;
    const {p}=req.query;
    
    models.fetchCommentsByArticleId(article_id,limit,p).then(comments=>{
        res.status(200).send({comments})
    }).catch((err) => {
       next(err) 
    });
}

exports.getArticles=(req,res,next) => {

    const {sort_by}=req.query;
    const {order}=req.query;
    const {topic}=req.query;
    const {limit}=req.query;
    const {p}=req.query;

    models.fetchArticles(sort_by,order,topic,limit,p).then(({articles,total_count})=>{
        res.status(200).send({articles,total_count});
    }).catch((err)=>next(err));
}

exports.postCommentByArticleId=(req,res,next)=>{
    const {article_id} =req.params;
    const comment= req.body;

    models.addCommentByArticleId(article_id,comment).then(([comment])=>{
        res.status(200).send({comment})
    }).catch((err)=> next(err));
}

exports.deleteCommentByCommentId=(req,res,next) =>{

    const {comment_id}=req.params;

    models.removeCommentByCommentId(comment_id).then(()=>{
        res.status(204).send({});
    }).catch((err)=>{
        next(err);
    })
}

exports.getApi=(req,res,next)=>{

}

exports.getTopicBySlug=(req,res,next)=>{

    const {slug} = req.params;

    models.fetchTopicBySlug(slug).then(([topic])=>{
        res.status(200).send({topic})
    }).catch((err)=>{
        next(err);
    });
    
}

exports.patchCommentById=(req,res,next)=>{

    const {comment_id} = req.params;
    const {inc_votes} = req.body;

    models.updateCommentById(comment_id,inc_votes).then((comment)=>{
        res.status(200).send({comment});
    }).catch(err => {
        next(err);
    })
}