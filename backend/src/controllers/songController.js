const getAllSongs=(req,res)=>{
    res.status(200).json({
        success:true,
        message:"get all songs controller working"
    });
}