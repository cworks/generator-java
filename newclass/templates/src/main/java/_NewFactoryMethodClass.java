<%= codeHeader %>
<%= package %>

/**
 * ----------------------------------------------------------------------------
 * Tell me a little something about this <%= className %>
 * @author you
 * ----------------------------------------------------------------------------
 */
public final class <%= className %> {

    /**
     * Static factory method returns an object of this class.
     */
    public static <%= className %> create() {
        return new <%= className %>();
    }

    /**
     * Caller cannot see this private constructor.
     *
     * The only way to build a <%= className %> is by calling the static
     * factory method.
     */
    private <%= className %>() {
        
    }

    @Override
    public String toString() {
        return "<%= className %>{}";
    }

}